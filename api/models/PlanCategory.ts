import planCategoriesData from '../../data/planCategories';
import plansData from '../../data/plans';
import { Lang } from '../types';
import Plan from './Plan';

export type PlanCategoryType = 'MEMBERSHIP' | 'COMMITTEE';

export interface PlanCategoryBenefice {
  id: number;
  title: string;
}

export default class PlanCategory {
  id: number;

  title: string;

  description: string;

  type: PlanCategoryType;

  benefices: Array<PlanCategoryBenefice>;

  plans: Array<Plan>;

  constructor(data: {
    id: number;
    title: string;
    description: string;
    type: PlanCategoryType;
    benefices: Array<PlanCategoryBenefice>;
    plans: Array<Plan>;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.type = data.type;
    this.benefices = data.benefices;
    this.plans = data.plans;
  }

  static getAll(
    lang: Lang,
    filters: { categoryType?: PlanCategoryType } = {}
  ): Promise<Array<PlanCategory>> {
    const planCategories = planCategoriesData
      .filter((planCategoryData) => {
        return (
          !filters.categoryType ||
          planCategoryData.type === filters.categoryType
        );
      })
      .map(
        (planCategoryData): PlanCategory => {
          return new PlanCategory({
            id: planCategoryData.id,
            title: planCategoryData.title[lang],
            description: planCategoryData.description[lang],
            type: planCategoryData.type as PlanCategoryType,
            benefices: planCategoryData.benefices.map((benefice) => {
              return {
                id: benefice.id,
                title: benefice.title[lang],
              };
            }),
            plans: plansData.map(
              (planData): Plan => {
                return new Plan({
                  id: planData.id,
                  title: planData.title[lang],
                  description: planData.description[lang],
                  color: planData.color,
                  images: planData.images,
                  benefices: planData.benefices,
                  prices: planData.prices,
                  options: planData.options,
                  file: planData.file[lang],
                });
              }
            ),
          });
        }
      );

    return Promise.resolve(planCategories);
  }

  static async getOne(
    lang: Lang,
    categoryId: number
  ): Promise<PlanCategory | undefined> {
    const planCategories = await this.getAll(lang);
    return planCategories.find((planCategory) => {
      return planCategory.id === categoryId;
    });
  }
}
