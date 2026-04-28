#!/usr/bin/env python3
"""
LinkedIn Nugget Engine — Yash Joglekar's daily thought-to-content agent.

Usage:
  python3 nugget/nugget.py capture "raw thought"   — capture a thought, get a reaction
  python3 nugget/nugget.py chat                    — interactive daytime dialogue
  python3 nugget/nugget.py list [YYYY-MM-DD]       — see today's captures
  python3 nugget/nugget.py night [YYYY-MM-DD]      — synthesize into LinkedIn content
"""

import argparse
import json
import os
import sys
from datetime import date, datetime
from pathlib import Path

import anthropic

STORAGE_DIR = Path.home() / ".nugget"
MODEL = "claude-opus-4-7"

# ── Voice System Prompt ────────────────────────────────────────────────────────
# Cached on every call — put stable content first.

VOICE_SYSTEM_PROMPT = """\
You are the LinkedIn Nugget Engine for Yash Joglekar.

## Who Yash is

Yash works at the intersection of civic tech, urban governance, and waste management \
policy in India. His expertise spans:
- Solid Waste Management (SWM) Rules 2016, EPR frameworks, municipal waste processing
- Urban Local Bodies (ULBs), the 74th Amendment, and how Indian cities actually function
- The informal waste economy — kabadiwalas, waste pickers, door-to-door collectors
- The gap between what policy says and what happens at the dhalao
- Civic tech, ward-level governance, and MyCityPulse (his product)
- The political economy of environmental compliance in India

## Yash's voice

Sharp. Grounded. Analytical without being preachy.

He:
- Leads with Indian context — not as a footnote but as the frame
- Names specific things: dhalao, kabadiwala, ULB, EPR, MRF, SWM 2016, bulk waste \
generator, ward committee, legacy dump, Swachh Bharat, CPCB, legacy landfill
- Avoids generic startup language: "ecosystem", "scalable", "disruption", \
"change agents", "stakeholders"
- Avoids generic climate-tech language: "net zero journey", "planet-positive", \
"sustainability champion", "green transition"
- Calls out the gap between policy aspiration and ground reality — specifically, \
with numbers or examples where possible
- Trusts readers to handle complexity; doesn't over-explain
- Is comfortable being contrarian when the data supports it
- Prefers one sharp insight over three safe ones
- References real Indian institutions, real timelines, real bureaucratic friction

## Daytime mode (capture / chat)

When Yash shares something he read or thought about:
1. Give a sharp 2–3 line reaction — what's interesting, what's missing, what it \
connects to in the India context
2. Ask one good question that helps him think deeper — not a generic "what do you \
think?" but a specific provocation
3. If there's a clear LinkedIn angle, note it in one line: "Post angle: ..."

Keep reactions tight. No lectures. Be a thinking partner, not a summarizer.

## Nighttime synthesis mode

When Yash asks for the synthesis of the day's captures, produce all five parts:

### 1. Sharp LinkedIn Post
200–400 words. Structured but human. Opens with a specific observation or data point — \
not "I've been thinking about" or "Excited to share". Uses line breaks for readability. \
Ends with a perspective or question that invites response, not a generic CTA.

### 2. Punchier opening line
One alternative first line — more arresting than the post's opener. One sentence.

### 3. Less polished, more human version
150–200 words. Sounds like Yash talking, not writing. First person, informal, \
a bit rougher around the edges. Like he's typing fast.

### 4. One deeper follow-up post idea
Topic + angle + one sentence on why it would land with Yash's audience.

### 5. Three comments to extend the conversation
Each 2–4 sentences. Three different angles:
- One provocation (challenges a common assumption)
- One ground-level reality check (what actually happens on the ground)
- One policy/data angle (specific number, rule, or institutional gap)

Everything: Indian context first. No generic language. Sharp over safe.\
"""


# ── Storage helpers ────────────────────────────────────────────────────────────

def _day_dir(day: str | None = None) -> Path:
    d = day or date.today().isoformat()
    p = STORAGE_DIR / d
    p.mkdir(parents=True, exist_ok=True)
    return p


def _load_json(path: Path) -> list:
    if not path.exists():
        return []
    return json.loads(path.read_text())


def _save_json(path: Path, data):
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False))


def load_captures(day: str | None = None) -> list:
    return _load_json(_day_dir(day) / "captures.json")


def save_captures(captures: list, day: str | None = None):
    _save_json(_day_dir(day) / "captures.json", captures)


def load_conversation(day: str | None = None) -> list:
    return _load_json(_day_dir(day) / "conversation.json")


def save_conversation(messages: list, day: str | None = None):
    _save_json(_day_dir(day) / "conversation.json", messages)


# ── Claude client ──────────────────────────────────────────────────────────────

def make_client() -> anthropic.Anthropic:
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        print("Error: ANTHROPIC_API_KEY environment variable not set.", file=sys.stderr)
        print("Set it with: export ANTHROPIC_API_KEY=your_key_here", file=sys.stderr)
        sys.exit(1)
    return anthropic.Anthropic(api_key=key)


def _system_blocks() -> list:
    """Return system prompt with cache_control on the stable block."""
    return [
        {
            "type": "text",
            "text": VOICE_SYSTEM_PROMPT,
            "cache_control": {"type": "ephemeral"},
        }
    ]


def _text_from_response(response) -> str:
    """Extract text from a response that may contain thinking blocks."""
    for block in response.content:
        if block.type == "text":
            return block.text
    return ""


# ── Commands ───────────────────────────────────────────────────────────────────

def cmd_capture(thought: str):
    """Quick capture: save thought + get a sharp AI reaction."""
    client = make_client()
    ts = datetime.now().isoformat()

    preview = thought[:70] + ("…" if len(thought) > 70 else "")
    print(f"\n[Capturing: {preview}]\n")

    response = client.messages.create(
        model=MODEL,
        max_tokens=600,
        system=_system_blocks(),
        messages=[
            {
                "role": "user",
                "content": (
                    "Quick capture — daytime mode.\n\n"
                    f"Thought / reading:\n{thought}"
                ),
            }
        ],
    )

    reaction = _text_from_response(response)
    print(reaction)

    captures = load_captures()
    captures.append({"timestamp": ts, "thought": thought, "reaction": reaction})
    save_captures(captures)

    cache_read = getattr(response.usage, "cache_read_input_tokens", 0)
    cache_hint = f" (cache hit: {cache_read} tokens)" if cache_read else ""
    print(f"\n[Saved · {date.today().isoformat()}{cache_hint}]\n")


def cmd_chat():
    """Interactive daytime dialogue — continues the day's conversation."""
    client = make_client()
    messages = load_conversation()

    print("\n── Nugget Engine · daytime mode ──────────────────────")
    print("Share what you read, what bothered you, what clicked.")
    print("Commands: 'save', 'quit'\n")

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n[Saving and exiting]")
            save_conversation(messages)
            break

        if not user_input:
            continue

        cmd = user_input.lower()
        if cmd == "quit":
            save_conversation(messages)
            print("[Conversation saved. Bye.]")
            break
        if cmd == "save":
            save_conversation(messages)
            print("[Saved.]")
            continue

        messages.append({"role": "user", "content": user_input})

        response = client.messages.create(
            model=MODEL,
            max_tokens=700,
            system=_system_blocks(),
            messages=messages,
        )

        reply = _text_from_response(response)
        messages.append({"role": "assistant", "content": reply})
        save_conversation(messages)

        print(f"\nNugget: {reply}\n")


def cmd_list(day: str | None = None):
    """Show captures and conversation summary for a day."""
    target = day or date.today().isoformat()
    captures = load_captures(target)
    conversation = load_conversation(target)

    print(f"\n── {target} ──────────────────────────────────────────")

    if not captures and not conversation:
        print("Nothing captured yet.\n")
        return

    if captures:
        print(f"\nCaptures ({len(captures)}):\n")
        for i, c in enumerate(captures, 1):
            ts = c["timestamp"][:16].replace("T", " ")
            snippet = c["thought"][:90] + ("…" if len(c["thought"]) > 90 else "")
            print(f"  [{i}] {ts}  {snippet}")

    if conversation:
        turns = len([m for m in conversation if m["role"] == "user"])
        print(f"\nChat: {turns} exchanges saved")

    synthesis_path = _day_dir(target) / "synthesis.md"
    if synthesis_path.exists():
        print("Synthesis: ✓ generated")

    print()


def cmd_night(day: str | None = None):
    """Nighttime mode: synthesize the day into full LinkedIn Nugget Engine output."""
    client = make_client()
    target = day or date.today().isoformat()

    captures = load_captures(target)
    conversation = load_conversation(target)

    if not captures and not conversation:
        print(f"\nNothing captured for {target}.")
        print("Use 'nugget capture' or 'nugget chat' during the day first.\n")
        return

    # Build synthesis context
    parts = [f"Date: {target}\n"]

    if captures:
        parts.append("=== Quick Captures ===")
        for c in captures:
            ts = c["timestamp"][:16].replace("T", " ")
            parts.append(f"\n[{ts}] {c['thought']}")
            if c.get("reaction"):
                # Trim long reactions for context
                r = c["reaction"][:300] + ("…" if len(c["reaction"]) > 300 else "")
                parts.append(f"  → {r}")

    if conversation:
        parts.append("\n=== Daytime Chat ===")
        for msg in conversation:
            role = "Yash" if msg["role"] == "user" else "Nugget"
            content = msg["content"][:400] + ("…" if len(msg["content"]) > 400 else "")
            parts.append(f"\n{role}: {content}")

    context = "\n".join(parts)

    print(f"\n── Synthesizing {target} ────────────────────────────")
    print("Thinking…\n")

    # Use adaptive thinking for deeper synthesis
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
                    f"{context}\n\n"
                    "Generate the full 5-part LinkedIn Nugget Engine output. "
                    "Use the strongest thread from today's captures as the anchor. "
                    "If there are multiple threads, pick the one with the sharpest angle "
                    "for Yash's audience (Indian urban governance / civic tech professionals)."
                ),
            }
        ],
    )

    output = _text_from_response(response)
    print(output)

    # Save synthesis
    synthesis_path = _day_dir(target) / "synthesis.md"
    synthesis_path.write_text(
        f"# LinkedIn Nugget · {target}\n\n{output}\n",
        encoding="utf-8",
    )

    cache_read = getattr(response.usage, "cache_read_input_tokens", 0)
    cache_hint = f" · cache hit: {cache_read} tokens" if cache_read else ""
    print(f"\n\n[Saved → ~/.nugget/{target}/synthesis.md{cache_hint}]\n")


# ── CLI ────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        prog="nugget",
        description="LinkedIn Nugget Engine — Yash Joglekar's daily thought-to-content agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""\
Examples:
  python3 nugget/nugget.py capture "10 years of SWM 2016 — what worked, what didn't"
  python3 nugget/nugget.py chat
  python3 nugget/nugget.py list
  python3 nugget/nugget.py night
  python3 nugget/nugget.py list 2026-04-27
  python3 nugget/nugget.py night 2026-04-27
""",
    )

    sub = parser.add_subparsers(dest="command", metavar="COMMAND")

    p_capture = sub.add_parser("capture", help="Capture a thought or reading + get a reaction")
    p_capture.add_argument("thought", help="Raw thought, article snippet, or observation")

    sub.add_parser("chat", help="Interactive daytime dialogue (continues today's thread)")

    p_list = sub.add_parser("list", help="See captures for a day (default: today)")
    p_list.add_argument("date", nargs="?", metavar="YYYY-MM-DD", help="Date to inspect")

    p_night = sub.add_parser("night", help="Synthesize a day's captures into LinkedIn content")
    p_night.add_argument("date", nargs="?", metavar="YYYY-MM-DD", help="Date to synthesize")

    args = parser.parse_args()

    if args.command == "capture":
        cmd_capture(args.thought)
    elif args.command == "chat":
        cmd_chat()
    elif args.command == "list":
        cmd_list(getattr(args, "date", None))
    elif args.command == "night":
        cmd_night(getattr(args, "date", None))
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
