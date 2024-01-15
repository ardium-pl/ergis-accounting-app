import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { PDFDocumentProxy, default as pdfjs } from 'pdfjs-dist';
import { isDefined } from 'simple-bool';
import { FileStorageService } from '../file-storage/file-storage.service';
import { PolymerscanMatch } from './polymerscan.types';

@Injectable({
  providedIn: 'root',
})
export class PolymerscanService {
  constructor(private _fileStorage: FileStorageService, private http: HttpClient) {}

  private readonly SEARCH_PHRASE_REGEXP = /European LDPE|European polypropylene/;

  private readonly _response = signal<any>(null);
  public readonly response = computed(() => this._response());
  public readonly jsonResponse = computed(() => {
    const rsp = this._response();
    if (!rsp) return null;
    try {
      const json = JSON.parse(rsp) as any[];
      return json;
    } catch (err) {
      alert('Wystąpił błąd w czasie próby odczytania danych pozyskanych od AI. Zgłoś ten błąd administratorom!');
      console.error(err);
      return null;
    }
  });

  /**
   * Processes a single page and extracts all the text from that page.
   * @param pdf The pdf file to process
   * @param pageNumber The number of the page to be processed
   * @returns The content of the page, as string.
   */
  private async _processPage(pdf: PDFDocumentProxy, pageNumber: number): Promise<string> {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    return textContent.items.map(item => (item as any).str).join(' ');
  }

  /**
   * Extracts text from two whole pages and combines it together
   * @param pdf The pdf file to extract text from
   * @param startPageNumber The page to start extracting from
   * @param totalPages The total number of pages in the pdf file
   * @param initialContent The initial text content
   * @returns The extracted content of the pages
   */
  private async _extractAndCombineText(pdf: PDFDocumentProxy, startPageNumber: number, initialContent: string) {
    const textArray = [initialContent];
    // start from the next page after the phrase is found
    for (let i = 1; i <= 2 && startPageNumber + i <= pdf.numPages; i++) {
      const pageContent = await this._processPage(pdf, startPageNumber + i);
      textArray.push(pageContent.trim());
    }
    return textArray.join(' ');
  }

  /**
   *
   * @param pdf The pdf file to process
   * @param phrasesRegExp A RegExp used to match the phrase to be searched for
   * @returns An array of objects
   */
  private async _processPhraseExtraction(pdf: PDFDocumentProxy, phrasesRegExp: RegExp): Promise<PolymerscanMatch | null> {
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const pageContent = await this._processPage(pdf, pageNum);
      const phraseMatch = phrasesRegExp.exec(pageContent);
      const phraseIndex = phraseMatch?.index;
      if (!isDefined(phraseIndex)) continue;

      const phrase = phraseMatch![0];
      const contentAfterPhrase = pageContent.substring(phraseIndex);
      const combinedText = await this._extractAndCombineText(pdf, pageNum, contentAfterPhrase);
      return { searchedPhrase: phrase, textContent: combinedText };
    }

    return null;
  }

  public async processPdf() {
    const pdfData = this._fileStorage.fileBuffer();
    const fileType = this._fileStorage.fileType();
    if (!pdfData || fileType != 'pdf') return;
    const pdfLoadingTask = pdfjs.getDocument(pdfData);

    const pdf = await pdfLoadingTask.promise;
    const found = await this._processPhraseExtraction(pdf, this.SEARCH_PHRASE_REGEXP);

    this.http
      .post<any>('/send-polymerScan-data-for-summary', {
        polymerScan: found,
      })
      .subscribe({
        next: v => {
          this._response.set(v.data);
        },
        error: err => {
          alert('Wystąpił błąd w czasie próby skontaktowania się z serwerem AI. Zgłoś ten błąd administratorom!');
          console.error(err);
        },
      });
  }
}
