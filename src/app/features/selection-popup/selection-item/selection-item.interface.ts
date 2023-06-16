export interface SelectionItem {
  oid: string;
  name: string;
  selected: boolean;
  uom?: string;
  pricePerUom?: number;
  frameWidthMM?: number;
  cashRegisterNumber?: number;
  thumbnailUrl?: string;
}
