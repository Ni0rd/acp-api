interface PlanData {
  id: number;
  title: number;
}

interface PlanImages {
  horizontal: string;
  square: string;
}

interface PlanPrice {
  id: number;
  title: string;
  description: string;
  price: number;
}

interface PlanOption {
  id: number;
  title: string;
  description: string;
  price: number;
}

export default class Plan {
  id: number;

  title: string;

  description: string;

  color: string;

  images: PlanImages;

  benefices: Array<number>;

  prices: Array<PlanPrice>;

  options: Array<PlanOption>;

  file: string;

  constructor(data: {
    id: number;
    title: string;
    description: string;
    color: string;
    images: PlanImages;
    benefices: Array<number>;
    prices: Array<PlanPrice>;
    options: Array<PlanOption>;
    file: string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.color = data.color;
    this.images = data.images;
    this.benefices = data.benefices;
    this.prices = data.prices;
    this.options = data.options;
    this.file = data.file;
  }
}
