import { ApiDocModelProperty } from './api-doc-property.decorator';

export const fetchAllResponseFactory: (contentClass: any) => any = (contentClass: any) => {
  class FetchAllResponseClass {
    @ApiDocModelProperty(`The count of total elements.`)
    totalElements: number;

    @ApiDocModelProperty('The content', {
      type: contentClass
    })
    content: any[];

    constructor(findAndCountAll: any) {
      this.totalElements = findAndCountAll.count;
      this.content = findAndCountAll.rows;
    }
  }
  return FetchAllResponseClass;
};
