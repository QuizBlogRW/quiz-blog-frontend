import { lazy, Suspense } from 'react';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';

// Lazy load PDF components
const PDFDownloadLink = lazy(() =>
  import('@react-pdf/renderer').then(module => ({
    default: module.PDFDownloadLink
  }))
);

const LazyPdfDownload = ({ document, fileName, children, ...props }) => {
  return (
    <Suspense fallback={<QBLoadingSM />}>
      <PDFDownloadLink
        document={document}
        fileName={fileName}
        {...props}
      >
        {children}
      </PDFDownloadLink>
    </Suspense>
  );
};

export default LazyPdfDownload;
