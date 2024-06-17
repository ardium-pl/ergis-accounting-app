import { DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, ViewEncapsulation, computed, effect, inject, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  ArdViewportObserverRef,
  ArdiumViewportObserverService,
  FileSystemMethod,
  FileSystemService,
  ViewportRelation,
} from '@ardium-ui/devkit';
import {
  ButtonComponent,
  EditableDataTableComponent,
  ErrorBoxComponent,
  FileDisplayComponent,
  FileDropZoneComponent,
  FinalTableComponent,
  IconButtonComponent,
  SectionComponent,
  SelectComponent,
} from '@components';
import { ExcelService } from '@services/excel';
import { FaktoringObject, FaktoringService, FinalFaktoringObject, LeftOverObject } from '@services/faktoring';
import { randomBetween, sleep } from '@utils';
import { Subscription } from 'rxjs';
import { IconComponent } from 'src/app/components/icon/icon.component';

@Component({
  selector: '_faktoring-page',
  standalone: true,
  imports: [
    SectionComponent,
    FileDropZoneComponent,
    FileDisplayComponent,
    MatProgressSpinnerModule,
    ButtonComponent,
    ErrorBoxComponent,
    HttpClientModule,
    FinalTableComponent,
    IconButtonComponent,
    DecimalPipe,
    SelectComponent,
    EditableDataTableComponent,
    IconComponent,
  ],
  providers: [FileSystemService, ArdiumViewportObserverService],
  templateUrl: './faktoring.page.html',
  styleUrl: './faktoring.page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FaktoringPage implements AfterViewInit, OnDestroy {
  private readonly _viewportObserver = inject(ArdiumViewportObserverService);
  public readonly faktoringService = inject(FaktoringService);
  private readonly fileSystem = inject(FileSystemService);
  private readonly excelService = inject(ExcelService);

  constructor() {
    effect(() => {
      if (this.faktoringService.hasPrn()) {
        setTimeout(() => {
          this._tableObserver = this._viewportObserver.observeById('editable-table', { margin: -50 });
          const sub = this._tableObserver.viewportRelation.subscribe(v => {
            this._tableViewportRelation.set(v);
          });
          this._subs.push(sub);
        }, 0);
      } else {
        this._tableObserver?.destroy();
        this._tableObserver = undefined;
      }
    });
  }
  ngAfterViewInit(): void {
    this._generateObserver = this._viewportObserver.observeById('generate-btn', { margin: -50 });

    const sub = this._generateObserver.viewportRelation.subscribe(v => {
      this._generateViewportRelation.set(v);
    });
    this._subs.push(sub);
  }
  ngOnDestroy(): void {
    this._tableObserver?.destroy();
    this._generateObserver?.destroy();
    this._subs.forEach(sub => sub.unsubscribe());
  }

  private _tableObserver?: ArdViewportObserverRef;
  private readonly _tableViewportRelation = signal<ViewportRelation>(ViewportRelation.Undefined);
  public readonly isSkipToTableVisible = computed(() => {
    return this.faktoringService.hasPrn() && this._tableViewportRelation() === ViewportRelation.Above;
  });
  public onSkipToTableClick(): void {
    const el = this._tableObserver?.element;
    if (!el) return;
    const htmlEl = document.scrollingElement;
    if (!htmlEl) return;

    const scrollTop = htmlEl.scrollTop;
    const elementPos = el.getBoundingClientRect().top;

    document.scrollingElement?.scrollTo(0, scrollTop + elementPos - 105);
  }

  private _generateObserver!: ArdViewportObserverRef;
  private readonly _generateViewportRelation = signal<ViewportRelation>(ViewportRelation.Undefined);
  public readonly isSkipToGenerateVisible = computed(() => {
    return (
      this.faktoringService.hasPrn() &&
      (this._generateViewportRelation() === ViewportRelation.Above || this._generateViewportRelation() === ViewportRelation.Below)
    );
  });
  public readonly isSkipToGenerateFlipped = computed(() => {
    return this.faktoringService.hasPrn() && this._generateViewportRelation() === ViewportRelation.Above;
  });
  public onSkipToGenerateClick(): void {
    const el = this._generateObserver?.element;
    if (!el) return;
    const htmlEl = document.scrollingElement;
    if (!htmlEl) return;

    const scrollTop = htmlEl.scrollTop;
    const elementPos = el.getBoundingClientRect().top;

    document.scrollingElement?.scrollTo(0, scrollTop + elementPos - window.innerHeight / 2);
  }

  private readonly _subs: Subscription[] = [];

  readonly isPrnLoading = signal<boolean>(false);
  onPrnFileUpload(file: File | File[]): void {
    const isSuccessful = this.faktoringService.setPrnFile(file as File);
    if (!isSuccessful) return;

    // for the appearance of smooth loading
    // the editable table takes quite a bit to load, so we temporarily display a loading state instead
    this.isPrnLoading.set(true);
    setTimeout(() => {
      this.isPrnLoading.set(false);
    }, 500);
  }
  onCsvFileUpload(file: File | File[]): void {
    this.faktoringService.setCsvFile(file as File);
  }

  readonly areResultsLoading = signal(false);
  private readonly _mismatchedAccount = signal<{
    prn: { obj: FaktoringObject; index: number };
    csv: { obj: FaktoringObject; index: number };
  } | null>(null);
  readonly mismatchedAccountMessage = computed<string | null>(() => {
    const v = this._mismatchedAccount();
    if (!v) return null;

    return `W pliku PRN konto
        "${v.prn.obj.konto}"
        subkonto
        "${v.prn.obj.subkonto}"
        (pozycja "${v.prn.obj.referencjaKG}", rząd ${v.prn.index + 1})
        <br/>W pliku CSV konto
        "${v.csv.obj.konto}"
        subkonto
        "${v.csv.obj.subkonto}"
        (pozycja "${v.csv.obj.referencjaKG}", rząd ${v.csv.index + 1})`;
  });

  async onGenerateButtonClick(): Promise<void> {
    if (!this.faktoringService.hasPrn()) return;

    this.areResultsLoading.set(true);
    // sleep for a short while so that if an error is thrown, the results aren't immediate
    await sleep(500);
    try {
      const processedData = this.faktoringService.processData();
      // sleep a short random amount of time to give the illusion of a complex algorithm creating the results
      if (!window.location.href.includes('localhost')) await sleep(randomBetween(4e3, 8e3));
      this.areResultsLoading.set(false);

      // scroll to errors after the section gets rendered
      setTimeout(() => {
        const element = document.getElementById('results')!;
        const headerOffset = 16;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }, 0);

      // notify the user there is no data generated
      if (!processedData) {
        this.tableData.set(null);
        this._leftovers.set(null);
        this.leftoversCount.set(null);
        return;
      }
      // now there is some data, split it into the table portion and unused entries portion
      const [data, leftovers] = processedData;
      //! table data
      this.tableData.set(data);
      //! leftovers
      // if there are no unused entries, display the appropriate message
      if (leftovers.length == 0) {
        this._leftovers.set(null);
        this.leftoversCount.set(null);
      } else {
        // there are some unused entries - allow for them to be downloaded
        this._leftovers.set(leftovers);
        this.leftoversCount.set(leftovers.length);
      }
      //! do accounts match alert
      const account = this.faktoringService.getMismatchedAccounts();
      this._mismatchedAccount.set(account);
    } catch (error) {
      if (error === 'ZERO_AMOUNT_ERR') {
        alert('Żadna z kwot nie może być równa zero!');
        return;
      }
      throw error;
    }
  }

    readonly tableData = signal<FinalFaktoringObject[] | null>(null);
    private readonly _leftovers = signal<LeftOverObject[] | null>(null);
    readonly leftoversCount = signal<number | null>(null);

  downloadLeftovers(): void {
    const leftovers = this._leftovers();
    if (!leftovers) return;
    const csvData = this.excelService.jsonToCsv(leftovers);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    this.fileSystem.saveAs(blob, {
      fileName: 'nieużyte',
      method: FileSystemMethod.PreferFileSystem,
      types: [
        {
          description: 'Plik CSV',
          accept: { 'text/csv': ['.csv'] },
        },
      ],
    });
  }
}
