import CoverPage from './pages/CoverPage.jsx';
import PhotoPage from './pages/PhotoPage.jsx';
import DataPage from './pages/DataPage.jsx';
import QuotePage from './pages/QuotePage.jsx';
import CTAPage from './pages/CTAPage.jsx';

export default function PageRenderer({ page }) {
  if (!page) return null;

  switch (page.type) {
    case 'cover':
      return <CoverPage title={page.title} subtitle={page.subtitle} image={page.image} />;
    case 'photo':
      return <PhotoPage image={page.image} caption={page.caption} credit={page.credit} />;
    case 'data':
      return (
        <DataPage
          component={page.component}
          props={page.props}
          headline={page.headline}
          body={page.body}
        />
      );
    case 'quote':
      return <QuotePage text={page.text} attribution={page.attribution} />;
    case 'cta':
      return <CTAPage headline={page.headline} body={page.body} action={page.action} />;
    default:
      return null;
  }
}
