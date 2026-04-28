#!/usr/bin/env python3
"""
LinkedIn Nugget Engine — Telegram bot for Yash Joglekar.

Daytime:  just send any message  → thinking-partner chat
          /c <thought>           → quick capture + reaction
Evening:  /night                 → full LinkedIn 5-part synthesis
Other:    /list                  → today's captures
          /start  /help          → usage
"""

import logging
import os
import sys
from datetime import date, datetime
from pathlib import Path

from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters,
)

sys.path.insert(0, str(Path(__file__).parent))
from nugget import (
    MODEL,
    _day_dir,
    _system_blocks,
    _text_from_response,
    load_captures,
    load_conversation,
    make_client,
    save_captures,
    save_conversation,
)

logging.basicConfig(
    format="%(asctime)s %(levelname)s %(message)s",
    level=logging.INFO,
)
log = logging.getLogger(__name__)

# ── Whitelist ─────────────────────────────────────────────────────────────────

_raw_uid = os.environ.get("TELEGRAM_USER_ID", "")
ALLOWED_UID: int | None = int(_raw_uid) if _raw_uid.isdigit() else None


def allowed(update: Update) -> bool:
    if ALLOWED_UID is None:
        return True
    return update.effective_user.id == ALLOWED_UID


async def _deny(update: Update):
    uid = update.effective_user.id
    log.warning("Blocked request from user %s", uid)
    await update.message.reply_text("Not authorised.")


# ── Helpers ───────────────────────────────────────────────────────────────────

TG_MAX = 4000  # Telegram message character limit


async def send_long(update: Update, text: str):
    """Send text that may exceed Telegram's 4096-char limit."""
    if len(text) <= TG_MAX:
        await update.message.reply_text(text)
        return
    chunks = [text[i : i + TG_MAX] for i in range(0, len(text), TG_MAX)]
    for i, chunk in enumerate(chunks, 1):
        header = f"({i}/{len(chunks)})\n\n" if len(chunks) > 1 else ""
        await update.message.reply_text(header + chunk)


# ── Handlers ──────────────────────────────────────────────────────────────────

async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not allowed(update):
        await _deny(update)
        return
    uid = update.effective_user.id
    await update.message.reply_text(
        f"Nugget Engine online.\n\n"
        f"Your Telegram user ID: {uid}\n\n"
        "Daytime:\n"
        "  Send any message → thinking-partner chat\n"
        "  /c <thought>     → quick capture + reaction\n\n"
        "Evening:\n"
        "  /night → full LinkedIn 5-part output\n"
        "  /list  → today's captures\n\n"
        "Set TELEGRAM_USER_ID in Fly secrets to lock this bot to your ID."
    )


async def cmd_help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not allowed(update):
        await _deny(update)
        return
    await update.message.reply_text(
        "Nugget Engine — commands\n\n"
        "Daytime:\n"
        "  <any text>   → thinking-partner chat\n"
        "  /c <thought> → quick capture + reaction\n\n"
        "Evening:\n"
        "  /night → LinkedIn synthesis\n"
        "  /list  → see today's captures"
    )


async def cmd_capture(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not allowed(update):
        await _deny(update)
        return

    thought = " ".join(context.args).strip()
    if not thought:
        await update.message.reply_text("Usage: /c your raw thought here")
        return

    await update.message.reply_text("…")

    client = make_client()
    response = client.messages.create(
        model=MODEL,
        max_tokens=600,
        system=_system_blocks(),
        messages=[
            {
                "role": "user",
                "content": f"Quick capture — daytime mode.\n\nThought / reading:\n{thought}",
            }
        ],
    )
    reaction = _text_from_response(response)

    ts = datetime.now().isoformat()
    captures = load_captures()
    captures.append({"timestamp": ts, "thought": thought, "reaction": reaction})
    save_captures(captures)

    await update.message.reply_text(f"{reaction}\n\n✓ Saved")


async def cmd_list(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not allowed(update):
        await _deny(update)
        return

    today = date.today().isoformat()
    captures = load_captures()
    conversation = load_conversation()

    if not captures and not conversation:
        await update.message.reply_text(f"Nothing captured yet today ({today}).")
        return

    lines = [f"{today}"]
    if captures:
        lines.append(f"\nCaptures ({len(captures)}):")
        for i, c in enumerate(captures, 1):
            ts = c["timestamp"][11:16]
            snippet = c["thought"][:80] + ("…" if len(c["thought"]) > 80 else "")
            lines.append(f"  {i}. [{ts}] {snippet}")
    if conversation:
        turns = len([m for m in conversation if m["role"] == "user"])
        lines.append(f"\nChat: {turns} exchanges saved")

    synthesis_path = _day_dir() / "synthesis.md"
    if synthesis_path.exists():
        lines.append("\nSynthesis: ✓ generated")

    await update.message.reply_text("\n".join(lines))


async def cmd_night(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not allowed(update):
        await _deny(update)
        return

    today = date.today().isoformat()
    captures = load_captures()
    conversation = load_conversation()

    if not captures and not conversation:
        await update.message.reply_text(
            "Nothing captured today.\n\n"
            "Send messages during the day or use /c to capture thoughts."
        )
        return

    await update.message.reply_text("Synthesising today's captures… (~20s)")

    # Build context
    parts = [f"Date: {today}\n"]
    if captures:
        parts.append("=== Quick Captures ===")
        for c in captures:
            ts = c["timestamp"][:16].replace("T", " ")
            parts.append(f"\n[{ts}] {c['thought']}")
            if c.get("reaction"):
                r = c["reaction"][:300] + ("…" if len(c["reaction"]) > 300 else "")
                parts.append(f"  → {r}")
    if conversation:
        parts.append("\n=== Daytime Chat ===")
        for msg in conversation:
            role = "Yash" if msg["role"] == "user" else "Nugget"
            content = msg["content"][:400] + ("…" if len(msg["content"]) > 400 else "")
            parts.append(f"\n{role}: {content}")

    context_text = "\n".join(parts)

    client = make_client()
    response = client.messages.create(
        model=MODEL,
        max_tokens=2500,
        thinking={"type": "adaptive"},
        system=_system_blocks(),
        messages=[
            {
                "role": "user",
                "content": (
                    "Nighttime synthesis.\n\n"
                    "Here is everything Yash captured today:\n\n"
                    f"{context_text}\n\n"
                    "Generate the full 5-part LinkedIn Nugget Engine output."
                ),
            }
        ],
    )

    output = _text_from_response(response)

    synthesis_path = _day_dir() / "synthesis.md"
    synthesis_path.write_text(f"# LinkedIn Nugget · {today}\n\n{output}\n", encoding="utf-8")

    await send_long(update, output)


async def chat_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Any non-command text → daytime thinking-partner mode."""
    if not allowed(update):
        await _deny(update)
        return

    text = update.message.text.strip()
    if not text:
        return

    messages = load_conversation()
    messages.append({"role": "user", "content": text})

    await update.message.reply_text("…")

    client = make_client()
    response = client.messages.create(
        model=MODEL,
        max_tokens=700,
        system=_system_blocks(),
        messages=messages,
    )
    reply = _text_from_response(response)
    messages.append({"role": "assistant", "content": reply})
    save_conversation(messages)

    await update.message.reply_text(reply)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    token = os.environ.get("TELEGRAM_TOKEN")
    if not token:
        print("Error: TELEGRAM_TOKEN environment variable not set.", file=sys.stderr)
        sys.exit(1)

    if ALLOWED_UID:
        log.info("Whitelist active — only responding to user ID %s", ALLOWED_UID)
    else:
        log.warning("TELEGRAM_USER_ID not set — bot responds to anyone")

    app = Application.builder().token(token).build()

    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("help", cmd_help))
    app.add_handler(CommandHandler("c", cmd_capture))
    app.add_handler(CommandHandler("capture", cmd_capture))
    app.add_handler(CommandHandler("list", cmd_list))
    app.add_handler(CommandHandler("night", cmd_night))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, chat_message))

    log.info("Nugget bot starting — polling mode")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
