export interface Quadra {
    id?: number;
    courtName: string;
    courtType: string;
    courtAddress: string;
    courtCity: string;
    courtState: string;
    courtCEP: string;
    courtPrice: number;
    courtRules: string;
    courtDescription: string;
    selectedDays: string;
    selectedTimeStart: number;
    selectedTimeEnd: number;
    courtImageUrl: string;
    courtDocumentUrl: string;
    slot: number;
}

export class Quadra {
    constructor(
        courtName: string,
        courtType: string,
        courtAddress: string,
        courtCity: string,
        courtState: string,
        courtCEP: string,
        courtPrice: number,
        courtRules: string,
        courtDescription: string,
        selectedDays: string,
        selectedTimeStart: number,
        selectedTimeEnd: number,
        courtImageUrl: string,
        courtDocumentUrl: string,
        slot: number,
        id?: number
    ) {
        this.id = id;
        this.courtName = courtName;
        this.courtType = courtType;
        this.courtAddress = courtAddress;
        this.courtCity = courtCity;
        this.courtState = courtState;
        this.courtCEP = courtCEP;
        this.courtPrice = courtPrice;
        this.courtRules = courtRules;
        this.courtDescription = courtDescription;
        this.selectedDays = selectedDays;
        this.selectedTimeStart = selectedTimeStart;
        this.selectedTimeEnd = selectedTimeEnd;
        this.courtImageUrl = courtImageUrl;
        this.courtDocumentUrl = courtDocumentUrl;
        this.slot = slot;
    }
}