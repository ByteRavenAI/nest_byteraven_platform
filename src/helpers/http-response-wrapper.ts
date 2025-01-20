export class ApiResponseWrapper<T> {
    status: number;
    description: string;
    data: T;
  
    constructor(status: number, description: string, data: T) {
      this.status = status;
      this.description = description;
      this.data = data;
    }
  }