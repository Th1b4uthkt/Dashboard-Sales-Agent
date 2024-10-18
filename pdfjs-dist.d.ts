declare module 'pdfjs-dist' {
    export * from 'pdfjs-dist/types/src/pdf';
  }
  
  declare module 'pdfjs-dist/build/pdf.worker.entry' {
    const workerSrc: string;
    export default workerSrc;
  }