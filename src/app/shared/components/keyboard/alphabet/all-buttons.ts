export class Button {
  key: string;
  rs: { displayValue: string; displayValueCL: string };
  en: { displayValue: string; displayValueCL: string };
}

export class KeyboardButtons {
  public ALL_BUTTONS: Button[] = [
    {
      key: '1',
      rs: { displayValue: 'q', displayValueCL: 'Q' },
      en: { displayValue: 'q', displayValueCL: 'Q' },
    },
    {
      key: '2',
      rs: { displayValue: 'w', displayValueCL: 'W' },
      en: { displayValue: 'w', displayValueCL: 'W' },
    },
    {
      key: '3',
      rs: { displayValue: 'e', displayValueCL: 'E' },
      en: { displayValue: 'e', displayValueCL: 'E' },
    },
    {
      key: '4',
      rs: { displayValue: 'r', displayValueCL: 'R' },
      en: { displayValue: 'r', displayValueCL: 'R' },
    },
    {
      key: '5',
      rs: { displayValue: 't', displayValueCL: 'T' },
      en: { displayValue: 't', displayValueCL: 'T' },
    },
    {
      key: '6',
      rs: { displayValue: 'z', displayValueCL: 'Z' },
      en: { displayValue: 'y', displayValueCL: 'Y' },
    },
    {
      key: '7',
      rs: { displayValue: 'u', displayValueCL: 'U' },
      en: { displayValue: 'u', displayValueCL: 'U' },
    },
    {
      key: '8',
      rs: { displayValue: 'i', displayValueCL: 'I' },
      en: { displayValue: 'i', displayValueCL: 'I' },
    },
    {
      key: '9',
      rs: { displayValue: 'o', displayValueCL: 'O' },
      en: { displayValue: 'o', displayValueCL: 'O' },
    },
    {
      key: '10',
      rs: { displayValue: 'p', displayValueCL: 'P' },
      en: { displayValue: 'p', displayValueCL: 'P' },
    },
    {
      key: '11',
      rs: { displayValue: 'š', displayValueCL: 'Š' },
      en: { displayValue: '[', displayValueCL: '{' },
    },
    {
      key: '12',
      rs: { displayValue: 'đ', displayValueCL: 'Đ' },
      en: { displayValue: ']', displayValueCL: '}' },
    },
    {
      key: '13',
      rs: { displayValue: 'a', displayValueCL: 'A' },
      en: { displayValue: 'a', displayValueCL: 'A' },
    },
    {
      key: '14',
      rs: { displayValue: 's', displayValueCL: 'S' },
      en: { displayValue: 's', displayValueCL: 'S' },
    },
    {
      key: '15',
      rs: { displayValue: 'd', displayValueCL: 'D' },
      en: { displayValue: 'd', displayValueCL: 'D' },
    },
    {
      key: '16',
      rs: { displayValue: 'f', displayValueCL: 'F' },
      en: { displayValue: 'f', displayValueCL: 'F' },
    },
    {
      key: '17',
      rs: { displayValue: 'g', displayValueCL: 'G' },
      en: { displayValue: 'g', displayValueCL: 'G' },
    },
    {
      key: '18',
      rs: { displayValue: 'h', displayValueCL: 'H' },
      en: { displayValue: 'h', displayValueCL: 'H' },
    },
    {
      key: '19',
      rs: { displayValue: 'j', displayValueCL: 'J' },
      en: { displayValue: 'j', displayValueCL: 'J' },
    },
    {
      key: '20',
      rs: { displayValue: 'k', displayValueCL: 'K' },
      en: { displayValue: 'k', displayValueCL: 'K' },
    },
    {
      key: '21',
      rs: { displayValue: 'l', displayValueCL: 'L' },
      en: { displayValue: 'l', displayValueCL: 'L' },
    },
    {
      key: '22',
      rs: { displayValue: 'č', displayValueCL: 'Č' },
      en: { displayValue: ';', displayValueCL: ':' },
    },
    {
      key: '23',
      rs: { displayValue: 'ć', displayValueCL: 'Ć' },
      en: { displayValue: '"', displayValueCL: '"' },
    },
    {
      key: '24',
      rs: { displayValue: 'ž', displayValueCL: 'Ž' },
      en: { displayValue: '|', displayValueCL: '|' },
    },
    {
      key: '25',
      rs: { displayValue: 'y', displayValueCL: 'Y' },
      en: { displayValue: 'z', displayValueCL: 'Z' },
    },
    {
      key: '26',
      rs: { displayValue: 'x', displayValueCL: 'X' },
      en: { displayValue: 'x', displayValueCL: 'X' },
    },
    {
      key: '27',
      rs: { displayValue: 'c', displayValueCL: 'C' },
      en: { displayValue: 'c', displayValueCL: 'C' },
    },
    {
      key: '28',
      rs: { displayValue: 'v', displayValueCL: 'V' },
      en: { displayValue: 'v', displayValueCL: 'V' },
    },
    {
      key: '29',
      rs: { displayValue: 'b', displayValueCL: 'B' },
      en: { displayValue: 'b', displayValueCL: 'B' },
    },
    {
      key: '30',
      rs: { displayValue: 'n', displayValueCL: 'N' },
      en: { displayValue: 'n', displayValueCL: 'N' },
    },
    {
      key: '31',
      rs: { displayValue: 'm', displayValueCL: 'M' },
      en: { displayValue: 'm', displayValueCL: 'M' },
    },
    {
      key: '32',
      rs: { displayValue: ',', displayValueCL: ';' },
      en: { displayValue: ',', displayValueCL: '<' },
    },
    {
      key: '33',
      rs: { displayValue: '.', displayValueCL: ':' },
      en: { displayValue: '.', displayValueCL: '>' },
    },
    {
      key: '34',
      rs: { displayValue: '-', displayValueCL: '_' },
      en: { displayValue: '/', displayValueCL: '?' },
    },
    {
      key: '35',
      rs: { displayValue: '`', displayValueCL: '~' },
      en: { displayValue: '`', displayValueCL: '~' },
    },
    {
      key: '36',
      rs: { displayValue: '1', displayValueCL: '!' },
      en: { displayValue: '1', displayValueCL: '!' },
    },
    {
      key: '37',
      rs: { displayValue: '2', displayValueCL: '"' },
      en: { displayValue: '2', displayValueCL: '@' },
    },
    {
      key: '38',
      rs: { displayValue: '3', displayValueCL: '#' },
      en: { displayValue: '3', displayValueCL: '#' },
    },
    {
      key: '39',
      rs: { displayValue: '4', displayValueCL: '$' },
      en: { displayValue: '4', displayValueCL: '$' },
    },
    {
      key: '40',
      rs: { displayValue: '5', displayValueCL: '%' },
      en: { displayValue: '5', displayValueCL: '%' },
    },
    {
      key: '41',
      rs: { displayValue: '6', displayValueCL: '&' },
      en: { displayValue: '6', displayValueCL: '^' },
    },
    {
      key: '42',
      rs: { displayValue: '7', displayValueCL: '/' },
      en: { displayValue: '7', displayValueCL: '&' },
    },
    {
      key: '43',
      rs: { displayValue: '8', displayValueCL: '(' },
      en: { displayValue: '8', displayValueCL: '*' },
    },
    {
      key: '44',
      rs: { displayValue: '9', displayValueCL: ')' },
      en: { displayValue: '9', displayValueCL: '(' },
    },
    {
      key: '45',
      rs: { displayValue: '0', displayValueCL: '=' },
      en: { displayValue: '0', displayValueCL: ')' },
    },
    {
      key: '46',
      rs: { displayValue: '?', displayValueCL: '?' },
      en: { displayValue: '-', displayValueCL: '_' },
    },
    {
      key: '47',
      rs: { displayValue: '+', displayValueCL: '*' },
      en: { displayValue: '=', displayValueCL: '+' },
    },
  ];

  getButtonById(key: string): Button {
    return this.ALL_BUTTONS.find((b) => b.key === key);
  }
}
