import { DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, computed, signal, effect } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { FileSaverSaveMethod, FileSaverService } from '@ardium-ui/devkit';
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
import { FaktoringMode, FaktoringObject, FaktoringService, FileStorageService, FinalFaktoringObject, PrnReaderService } from '@services';
import { parseYesNo, randomBetween, sleep } from '@utils';
import { ErrorBoxType } from 'src/app/components/error-box/error-box.types';
import { JsonDataStore } from 'src/app/utils/json-data-store';

const NO_UNUSED_NEGATIVES_MESSAGE = '\nWszystkie pozycje zostały wykorzystane!';

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
    ],
    providers: [FileSaverService, PrnReaderService],
    templateUrl: './faktoring.page.html',
    styleUrl: './faktoring.page.scss',
})
export class FaktoringPage {
    constructor(
        public fileStorage: FileStorageService,
        public faktoringService: FaktoringService,
        private fileSystem: FileSaverService,
        private prnReader: PrnReaderService,
        private router: Router
    ) {}

    private readonly pastData = new JsonDataStore<FaktoringObject>(v => {
        return {
            referencjaKG: v['referencjaKG'],
            naDzien: v['naDzien'],
            kwotaWWalucie: v['kwotaWWalucie'],
            kwotaWZl: v['kwotaWZł'] ?? v['kwotaWZl'],
            korekta: parseYesNo(v['korekta']),
        };
    });

    readonly FAKTORING_MODE_OPTIONS = [
        { value: FaktoringMode.Negative, label: 'Kwoty ujemne' },
        { value: FaktoringMode.Positive, label: 'Kwoty dodatnie' },
    ];
    faktoringMode: string = FaktoringMode.Negative;

    onFileUpload(file: File): void {
        if (file.size > 10 * 1024 * 1024) {
            alert('Plik musi być mniejszy niż 10 MB');
            return;
        }
        if (!file.name.toLowerCase().endsWith('.prn')) {
            alert('Plik musi być typu .prn');
            return;
        }
        this.fileStorage.setFile(file);

        this.isPrnLoading.set(true);
        setTimeout(() => {
            this.isPrnLoading.set(false);
        }, 500);
    }

    readonly isPrnLoading = signal<boolean>(false);

    readonly prnArray = computed(() => {
        const fileContent = this.fileStorage.fileContent();
        if (typeof fileContent === 'string') {
            return this.prnReader.readPrn(fileContent);
        }
        return [];
    });
    readonly prnHeaders = computed(() => {
        const fileContent = this.fileStorage.fileContent();
        if (typeof fileContent === 'string') {
            return this.prnReader.readPrnHeaders(fileContent);
        }
        return [];
    });

    readonly areResultsLoading = signal(false);

    readonly wasPastDataTouched = signal(false);
    readonly isPastDataValid = this.pastData.isDataValid;

    readonly errorBoxState = computed<ErrorBoxType>(() => {
        if (!this.wasPastDataTouched()) return ErrorBoxType.Info;
        if (!this.isPastDataValid()) {
            return ErrorBoxType.Error;
        }
        return ErrorBoxType.Success;
    });

    onPastDataBlur(v: string): void {
        this.wasPastDataTouched.set(true);
        this.pastData.setFromString(v);
    }
    onPastDataPaste(event: ClipboardEvent): void {
        const v = event.clipboardData!.getData('Text');
        this.onPastDataBlur(v);
    }

    async onGenerateButtonClick(): Promise<void> {
        const prn = this.prnArray();
        if (!prn.length) return;

        this.areResultsLoading.set(true);
        // sleep for a short while so that if an error is thrown, the results aren't immediate
        await sleep(500);
        const processedData = this.faktoringService.processData(prn, this.pastData.data(), this.faktoringMode as FaktoringMode);
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
            this.leftovers.set(NO_UNUSED_NEGATIVES_MESSAGE);
            this.leftoversCount.set(null);
            return;
        }
        // now there is some data, split it into the table portion and unused entries portion
        const [data, leftovers] = processedData;
        this.tableData.set(data);
        // if there are no unused entries, display the appropriate message
        if (leftovers.length == 0) {
            this.leftovers.set(NO_UNUSED_NEGATIVES_MESSAGE);
            this.leftoversCount.set(null);
            return;
        }
        // there are some unused entries - allow for them to be downloaded
        this.leftovers.set(JSON.stringify(leftovers));
        this.leftoversCount.set(leftovers.length);
    }

    TEMP_DATA = `[{"referencjaKG":"JL230822000058","currencyCorrection":172.11087242011698,"details":{"correctionAmount":4368.25,"negativeExchangeRate":4.48689998796317,"positiveExchangeRate":4.447499570766325,"lookUpPositiveAmount":4368.25,"lookUpNegativeAmount":-74188.97,"lookUpPositiveReference":"AR231102117892","lookUpNegativeReference":"JL230822000058"}},{"referencjaKG":"JL230822000058","currencyCorrection":76.45073664373467,"details":{"correctionAmount":1940.4,"negativeExchangeRate":4.48689998796317,"positiveExchangeRate":4.447500515357659,"lookUpPositiveAmount":1940.4,"lookUpNegativeAmount":-69820.72,"lookUpPositiveReference":"AR231102117893","lookUpNegativeReference":"JL230822000058"}},{"referencjaKG":"JL230822000058","currencyCorrection":120.15020329248243,"details":{"correctionAmount":3049.6,"negativeExchangeRate":4.48689998796317,"positiveExchangeRate":4.44750131164743,"lookUpPositiveAmount":3049.6,"lookUpNegativeAmount":-67880.32,"lookUpPositiveReference":"AR231102117893","lookUpNegativeReference":"JL230822000058"}},{"referencjaKG":"JL230822000058","currencyCorrection":41.02026746725287,"details":{"correctionAmount":1041.2,"negativeExchangeRate":4.48689998796317,"positiveExchangeRate":4.447502881290818,"lookUpPositiveAmount":1041.2,"lookUpNegativeAmount":-64830.72000000001,"lookUpPositiveReference":"AR231102117894","lookUpNegativeReference":"JL230822000058"}},{"referencjaKG":"JL230822000058","currencyCorrection":27.227629682309953,"details":{"correctionAmount":691.02,"negativeExchangeRate":4.48689998796317,"positiveExchangeRate":4.447497901652629,"lookUpPositiveAmount":691.02,"lookUpNegativeAmount":-63789.52000000001,"lookUpPositiveReference":"AR231102117894","lookUpNegativeReference":"JL230822000058"}},{"referencjaKG":"JL230822000058","currencyCorrection":5.074028450859982,"details":{"correctionAmount":128.7,"negativeExchangeRate":4.48689998796317,"positiveExchangeRate":4.447474747474748,"lookUpPositiveAmount":128.7,"lookUpNegativeAmount":-63098.500000000015,"lookUpPositiveReference":"AR231102117894","lookUpNegativeReference":"JL230822000058"}},{"referencjaKG":"JL230822000058","currencyCorrection":43.373851749255905,"details":{"correctionAmount":1100.85,"negativeExchangeRate":4.48689998796317,"positiveExchangeRate":4.447499659354135,"lookUpPositiveAmount":1100.85,"lookUpNegativeAmount":-62969.80000000002,"lookUpPositiveReference":"AR231102117894","lookUpNegativeReference":"JL230822000058"}},{"referencjaKG":"JL230822000058","currencyCorrection":875.1244329729916,"details":{"correctionAmount":30492,"negativeExchangeRate":4.48689998796317,"positiveExchangeRate":4.458199855699855,"lookUpPositiveAmount":30492,"lookUpNegativeAmount":-61868.95000000002,"lookUpPositiveReference":"AR231103117924","lookUpNegativeReference":"JL230822000058"}},{"referencjaKG":"JL230822000058","currencyCorrection":712.8037140049232,"details":{"correctionAmount":23760,"negativeExchangeRate":4.48689998796317,"positiveExchangeRate":4.456899831649832,"lookUpPositiveAmount":23760,"lookUpNegativeAmount":-31376.95000000002,"lookUpPositiveReference":"AR231106117947","lookUpNegativeReference":"JL230822000058"}},{"referencjaKG":"JL230822000058","currencyCorrection":228.50648484384843,"details":{"correctionAmount":7616.950000000019,"negativeExchangeRate":4.48689998796317,"positiveExchangeRate":4.456900252525252,"lookUpPositiveAmount":23760,"lookUpNegativeAmount":-7616.950000000019,"lookUpPositiveReference":"AR231106117947","lookUpNegativeReference":"JL230822000058"}},{"referencjaKG":"JL230823000026","currencyCorrection":321.2404305929334,"details":{"correctionAmount":16143.049999999981,"negativeExchangeRate":4.476799864469274,"positiveExchangeRate":4.456900252525252,"lookUpPositiveAmount":16143.049999999981,"lookUpNegativeAmount":-31048.31,"lookUpPositiveReference":"AR231106117947","lookUpNegativeReference":"JL230823000026"}},{"referencjaKG":"JL230823000026","currencyCorrection":296.61250086260713,"details":{"correctionAmount":14905.26000000002,"negativeExchangeRate":4.476799864469274,"positiveExchangeRate":4.456900010265952,"lookUpPositiveAmount":31755.46,"lookUpNegativeAmount":-14905.26000000002,"lookUpPositiveReference":"AR231106117947","lookUpNegativeReference":"JL230823000026"}},{"referencjaKG":"JL230824000032","currencyCorrection":133.11550509240251,"details":{"correctionAmount":16850.19999999998,"negativeExchangeRate":4.464799946473973,"positiveExchangeRate":4.456900010265952,"lookUpPositiveAmount":16850.19999999998,"lookUpNegativeAmount":-49321.8,"lookUpPositiveReference":"AR231106117947","lookUpNegativeReference":"JL230824000032"}},{"referencjaKG":"JL230824000032","currencyCorrection":1.1879807306303292,"details":{"correctionAmount":360,"negativeExchangeRate":4.464799946473973,"positiveExchangeRate":4.4615,"lookUpPositiveAmount":360,"lookUpNegativeAmount":-32471.600000000024,"lookUpPositiveReference":"AP231107060550","lookUpNegativeReference":"JL230824000032"}},{"referencjaKG":"JL230824000032","currencyCorrection":3.6714924394492763,"details":{"correctionAmount":1112.74,"negativeExchangeRate":4.464799946473973,"positiveExchangeRate":4.46150044035444,"lookUpPositiveAmount":1112.74,"lookUpNegativeAmount":-32111.600000000024,"lookUpPositiveReference":"JL231108000029","lookUpNegativeReference":"JL230824000032"}},{"referencjaKG":"JL230824000032","currencyCorrection":4.0733507292920335,"details":{"correctionAmount":173.2,"negativeExchangeRate":4.464799946473973,"positiveExchangeRate":4.4412817551963055,"lookUpPositiveAmount":173.2,"lookUpNegativeAmount":-30998.860000000022,"lookUpPositiveReference":"AP231110060973","lookUpNegativeReference":"JL230824000032"}},{"referencjaKG":"JL230824000032","currencyCorrection":37.27387260805583,"details":{"correctionAmount":885.4,"negativeExchangeRate":4.464799946473973,"positiveExchangeRate":4.422701603794895,"lookUpPositiveAmount":885.4,"lookUpNegativeAmount":-30825.66000000002,"lookUpPositiveReference":"AR231113118098","lookUpNegativeReference":"JL230824000032"}},{"referencjaKG":"JL230824000032","currencyCorrection":1020.5007025291111,"details":{"correctionAmount":24240,"negativeExchangeRate":4.464799946473973,"positiveExchangeRate":4.422700082508251,"lookUpPositiveAmount":24240,"lookUpNegativeAmount":-29940.26000000002,"lookUpPositiveReference":"AR231113118098","lookUpNegativeReference":"JL230824000032"}},{"referencjaKG":"JL230824000032","currencyCorrection":239.9806408877319,"details":{"correctionAmount":5700.26000000002,"negativeExchangeRate":4.464799946473973,"positiveExchangeRate":4.4227,"lookUpPositiveAmount":20000,"lookUpNegativeAmount":-5700.26000000002,"lookUpPositiveReference":"AR231113118099","lookUpNegativeReference":"JL230824000032"}},{"referencjaKG":"JL230825000026","currencyCorrection":433.4500239999972,"details":{"correctionAmount":7140.88,"negativeExchangeRate":4.483399805066042,"positiveExchangeRate":4.4227,"lookUpPositiveAmount":14299.73999999998,"lookUpNegativeAmount":-7140.88,"lookUpPositiveReference":"AR231113118099","lookUpNegativeReference":"JL230825000026"}},{"referencjaKG":"JL230829000064","currencyCorrection":320.00158182536654,"details":{"correctionAmount":7158.85999999998,"negativeExchangeRate":4.46740007540661,"positiveExchangeRate":4.4227,"lookUpPositiveAmount":7158.85999999998,"lookUpNegativeAmount":-46149.8,"lookUpPositiveReference":"AR231113118099","lookUpNegativeReference":"JL230829000064"}},{"referencjaKG":"JL230829000064","currencyCorrection":299.2376515867863,"details":{"correctionAmount":8853.16,"negativeExchangeRate":4.46740007540661,"positiveExchangeRate":4.433599980120093,"lookUpPositiveAmount":8853.16,"lookUpNegativeAmount":-38990.940000000024,"lookUpPositiveReference":"AR231114118121","lookUpNegativeReference":"JL230829000064"}},{"referencjaKG":"JL230829000064","currencyCorrection":511.00075406610654,"details":{"correctionAmount":10000,"negativeExchangeRate":4.46740007540661,"positiveExchangeRate":4.4163,"lookUpPositiveAmount":10000,"lookUpNegativeAmount":-30137.780000000024,"lookUpPositiveReference":"AR231115118157","lookUpNegativeReference":"JL230829000064"}},{"referencjaKG":"JL230829000064","currencyCorrection":761.536583777177,"details":{"correctionAmount":14902.9,"negativeExchangeRate":4.46740007540661,"positiveExchangeRate":4.416300183185823,"lookUpPositiveAmount":14902.9,"lookUpNegativeAmount":-20137.780000000024,"lookUpPositiveReference":"AR231115118158","lookUpNegativeReference":"JL230829000064"}},{"referencjaKG":"JL230829000064","currencyCorrection":166.9345223337897,"details":{"correctionAmount":3266.74,"negativeExchangeRate":4.46740007540661,"positiveExchangeRate":4.416298817781642,"lookUpPositiveAmount":3266.74,"lookUpNegativeAmount":-5234.880000000025,"lookUpPositiveReference":"JL231116000047","lookUpNegativeReference":"JL230829000064"}},{"referencjaKG":"JL230829000064","currencyCorrection":178.51041779160406,"details":{"correctionAmount":1968.1400000000249,"negativeExchangeRate":4.46740007540661,"positiveExchangeRate":4.376700014541224,"lookUpPositiveAmount":34385,"lookUpNegativeAmount":-1968.1400000000249,"lookUpPositiveReference":"AP231120061923","lookUpNegativeReference":"JL230829000064"}},{"referencjaKG":"JL230830000040","currencyCorrection":1078.465558749457,"details":{"correctionAmount":11364.28,"negativeExchangeRate":4.471599608598169,"positiveExchangeRate":4.376700014541224,"lookUpPositiveAmount":32416.859999999975,"lookUpNegativeAmount":-11364.28,"lookUpPositiveReference":"AP231120061923","lookUpNegativeReference":"JL230830000040"}},{"referencjaKG":"JL230901000044","currencyCorrection":250.95662349571143,"details":{"correctionAmount":2579.17,"negativeExchangeRate":4.474001326007979,"positiveExchangeRate":4.376700014541224,"lookUpPositiveAmount":21052.579999999973,"lookUpNegativeAmount":-2579.17,"lookUpPositiveReference":"AP231120061923","lookUpNegativeReference":"JL230901000044"}},{"referencjaKG":"JL230901000045","currencyCorrection":1797.462088865476,"details":{"correctionAmount":18473.409999999974,"negativeExchangeRate":4.473999976425114,"positiveExchangeRate":4.376700014541224,"lookUpPositiveAmount":18473.409999999974,"lookUpNegativeAmount":-78049.16,"lookUpPositiveReference":"AP231120061923","lookUpNegativeReference":"JL230901000045"}},{"referencjaKG":"JL230901000045","currencyCorrection":1493.707518087311,"details":{"correctionAmount":15351.62,"negativeExchangeRate":4.473999976425114,"positiveExchangeRate":4.3767003091530405,"lookUpPositiveAmount":15351.62,"lookUpNegativeAmount":-59575.75000000003,"lookUpPositiveReference":"AR231120118249","lookUpNegativeReference":"JL230901000045"}},{"referencjaKG":"JL230901000045","currencyCorrection":2358.559428544763,"details":{"correctionAmount":24240,"negativeExchangeRate":4.473999976425114,"positiveExchangeRate":4.376699669966997,"lookUpPositiveAmount":24240,"lookUpNegativeAmount":-44224.13000000003,"lookUpPositiveReference":"AR231120118249","lookUpNegativeReference":"JL230901000045"}},{"referencjaKG":"JL230901000045","currencyCorrection":1488.3173993928829,"details":{"correctionAmount":15296.24,"negativeExchangeRate":4.473999976425114,"positiveExchangeRate":4.376700417880473,"lookUpPositiveAmount":15296.24,"lookUpNegativeAmount":-19984.130000000026,"lookUpPositiveReference":"AR231120118249","lookUpNegativeReference":"JL230901000045"}},{"referencjaKG":"JL230901000045","currencyCorrection":512.3870081359246,"details":{"correctionAmount":4687.890000000027,"negativeExchangeRate":4.473999976425114,"positiveExchangeRate":4.3646998417939855,"lookUpPositiveAmount":31161.9,"lookUpNegativeAmount":-4687.890000000027,"lookUpPositiveReference":"AR231122118309","lookUpNegativeReference":"JL230901000045"}},{"referencjaKG":"JL230904000041","currencyCorrection":2745.3601009997938,"details":{"correctionAmount":26474.009999999973,"negativeExchangeRate":4.468400040630497,"positiveExchangeRate":4.3646998417939855,"lookUpPositiveAmount":26474.009999999973,"lookUpNegativeAmount":-92836.67,"lookUpPositiveReference":"AR231122118309","lookUpNegativeReference":"JL230904000041"}},{"referencjaKG":"JL230904000041","currencyCorrection":3386.5145508644728,"details":{"correctionAmount":32656.86,"negativeExchangeRate":4.468400040630497,"positiveExchangeRate":4.364700096702499,"lookUpPositiveAmount":32656.86,"lookUpNegativeAmount":-66362.66000000003,"lookUpPositiveReference":"AR231122118310","lookUpNegativeReference":"JL230904000041"}},{"referencjaKG":"JL230904000041","currencyCorrection":2966.115676269851,"details":{"correctionAmount":33705.80000000003,"negativeExchangeRate":4.468400040630497,"positiveExchangeRate":4.380399884091568,"lookUpPositiveAmount":34510,"lookUpNegativeAmount":-33705.80000000003,"lookUpPositiveReference":"AR231123118335","lookUpNegativeReference":"JL230904000041"}},{"referencjaKG":"JL230906000040","currencyCorrection":68.27668322444589,"details":{"correctionAmount":804.199999999968,"negativeExchangeRate":4.465300012448256,"positiveExchangeRate":4.380399884091568,"lookUpPositiveAmount":804.199999999968,"lookUpNegativeAmount":-15825.51,"lookUpPositiveReference":"AR231123118335","lookUpNegativeReference":"JL230906000040"}},{"referencjaKG":"JL230906000040","currencyCorrection":1217.0291484444977,"details":{"correctionAmount":14334.9,"negativeExchangeRate":4.465300012448256,"positiveExchangeRate":4.380400281829661,"lookUpPositiveAmount":14334.9,"lookUpNegativeAmount":-15021.310000000032,"lookUpPositiveReference":"AR231123118335","lookUpNegativeReference":"JL230906000040"}},{"referencjaKG":"JL230906000040","currencyCorrection":69.05285454461053,"details":{"correctionAmount":686.4100000000326,"negativeExchangeRate":4.465300012448256,"positiveExchangeRate":4.3647,"lookUpPositiveAmount":80000,"lookUpNegativeAmount":-686.4100000000326,"lookUpPositiveReference":"JL231124000037","lookUpNegativeReference":"JL230906000040"}},{"referencjaKG":"JL230906000041","currencyCorrection":5139.768535999974,"details":{"correctionAmount":51091.12,"negativeExchangeRate":4.465300036483835,"positiveExchangeRate":4.3647,"lookUpPositiveAmount":79313.58999999997,"lookUpNegativeAmount":-51091.12,"lookUpPositiveReference":"JL231124000037","lookUpNegativeReference":"JL230906000041"}},{"referencjaKG":"JL230911000021","currencyCorrection":6371.173795999996,"details":{"correctionAmount":27785.32,"negativeExchangeRate":4.593999997120782,"positiveExchangeRate":4.3647,"lookUpPositiveAmount":28222.469999999965,"lookUpNegativeAmount":-27785.32,"lookUpPositiveReference":"JL231124000037","lookUpNegativeReference":"JL230911000021"}},{"referencjaKG":"JL230912000056","currencyCorrection":103.69194536424979,"details":{"correctionAmount":437.1499999999651,"negativeExchangeRate":4.601899920769205,"positiveExchangeRate":4.3647,"lookUpPositiveAmount":437.1499999999651,"lookUpNegativeAmount":-45727.17,"lookUpPositiveReference":"JL231124000037","lookUpNegativeReference":"JL230912000056"}},{"referencjaKG":"JL230912000056","currencyCorrection":156.3693900628443,"details":{"correctionAmount":680.76,"negativeExchangeRate":4.601899920769205,"positiveExchangeRate":4.37220165697162,"lookUpPositiveAmount":680.76,"lookUpNegativeAmount":-45290.02000000003,"lookUpPositiveReference":"AP231127062545","lookUpNegativeReference":"JL230912000056"}},{"referencjaKG":"JL230912000056","currencyCorrection":56.38031655359391,"details":{"correctionAmount":245.44,"negativeExchangeRate":4.601899920769205,"positiveExchangeRate":4.372188722294654,"lookUpPositiveAmount":245.44,"lookUpNegativeAmount":-44609.26000000003,"lookUpPositiveReference":"AP231127062547","lookUpNegativeReference":"JL230912000056"}},{"referencjaKG":"JL230912000056","currencyCorrection":8.639494018545218,"details":{"correctionAmount":37.63,"negativeExchangeRate":4.601899920769205,"positiveExchangeRate":4.372309327664097,"lookUpPositiveAmount":37.63,"lookUpNegativeAmount":-44363.82000000003,"lookUpPositiveReference":"AP231127062549","lookUpNegativeReference":"JL230912000056"}},{"referencjaKG":"JL230912000056","currencyCorrection":643.8050979319302,"details":{"correctionAmount":2802.8,"negativeExchangeRate":4.601899920769205,"positiveExchangeRate":4.372199229342086,"lookUpPositiveAmount":2802.8,"lookUpNegativeAmount":-44326.19000000003,"lookUpPositiveReference":"AR231127118377","lookUpNegativeReference":"JL230912000056"}},{"referencjaKG":"JL230912000056","currencyCorrection":355.3391774299599,"details":{"correctionAmount":1547,"negativeExchangeRate":4.601899920769205,"positiveExchangeRate":4.372204266321914,"lookUpPositiveAmount":1547,"lookUpNegativeAmount":-41523.39000000003,"lookUpPositiveReference":"AR231127118377","lookUpNegativeReference":"JL230912000056"}},{"referencjaKG":"JL230912000056","currencyCorrection":963.6405476109709,"details":{"correctionAmount":4195.2,"negativeExchangeRate":4.601899920769205,"positiveExchangeRate":4.372199180015255,"lookUpPositiveAmount":4195.2,"lookUpNegativeAmount":-39976.39000000003,"lookUpPositiveReference":"JL231128000065","lookUpNegativeReference":"JL230912000056"}},{"referencjaKG":"JL230912000056","currencyCorrection":1375.7365297699378,"details":{"correctionAmount":5556.3,"negativeExchangeRate":4.601899920769205,"positiveExchangeRate":4.35430052372982,"lookUpPositiveAmount":5556.3,"lookUpNegativeAmount":-35781.19000000003,"lookUpPositiveReference":"AR231128118410","lookUpNegativeReference":"JL230912000056"}},{"referencjaKG":"JL230912000056","currencyCorrection":11.020893543160437,"details":{"correctionAmount":43.63,"negativeExchangeRate":4.601899920769205,"positiveExchangeRate":4.349300939720376,"lookUpPositiveAmount":43.63,"lookUpNegativeAmount":-30224.890000000032,"lookUpPositiveReference":"JL231201000092","lookUpNegativeReference":"JL230912000056"}}]`;

    readonly tableData = signal<FinalFaktoringObject[] | null>(JSON.parse(this.TEMP_DATA));
    readonly leftovers = signal<string>(NO_UNUSED_NEGATIVES_MESSAGE);
    readonly leftoversCount = signal<number | null>(null);
    readonly hasAnyLeftovers = computed(() => {
        return this.leftovers() != NO_UNUSED_NEGATIVES_MESSAGE;
    });

    downloadLeftovers(): void {
        if (!this.hasAnyLeftovers()) return;

        this.fileSystem.saveAs(this.leftovers(), {
            fileName: 'nieużyte.txt',
            method: FileSaverSaveMethod.PreferFileSystem,
            types: [
                {
                    description: 'Plik tekstowy',
                    accept: { 'text/plain': ['.txt'] },
                },
                {
                    description: 'Plik JSON',
                    accept: { 'application/json': ['.json', '.jsonc'] },
                },
            ],
        });
    }
}
