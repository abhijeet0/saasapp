import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { Model, Document, Types, ObjectId, FilterQuery } from 'mongoose';
import { CustomMessages } from '../utils/custom-messages';
import { StatusCodes } from '../utils/status-codes';
import { Response } from '../utils/response';

@Injectable()
export class CommonCrudService<T extends Document> {
  
  constructor(private readonly model: Model<T>) {}

  async findAll(filterCondition: Object, size: number, page: number) {
    try {
      let result = await this.model.find(filterCondition).limit(size).skip(page).sort({ updated_at: -1 }).exec();      
      if (!result) {
        return new Response(false, StatusCodes.BAD_REQUEST, CustomMessages.ENTRY_NOT_PRESENT, {});
      } else {
        return new Response(true, StatusCodes.OK, CustomMessages.SUCCESS, result);
      }
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  async findOne(filter:Object){
    try {
      let result = await this.model.findOne(filter).exec();
      if (!result) {
        return new Response(false, StatusCodes.BAD_REQUEST, CustomMessages.ENTRY_NOT_PRESENT, {});
      } else {
        return new Response(true, StatusCodes.OK, CustomMessages.SUCCESS, result);
      }
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
   
  }

  async findMany(filter:Object){
    try {
      let result = await this.model.find(filter).exec();
      if (!result) {
        return new Response(false, StatusCodes.BAD_REQUEST, CustomMessages.ENTRY_NOT_PRESENT, {});
      } else {
        return new Response(true, StatusCodes.OK, CustomMessages.SUCCESS, result);
      }
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
   
  }

  async findById(id:string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format: ${id}`);
    }
    let result =  await this.model.findOne({ _id: id });
    if (!result) {
      return new Response(false, StatusCodes.BAD_REQUEST, CustomMessages.ENTRY_NOT_PRESENT, {});
    } else {
        return new Response(true, StatusCodes.OK, CustomMessages.SUCCESS, result);
    }
  }

  async create(entity) {
    try {
      let payload = {};
      payload = entity;
      payload['created_at'] = new Date();
      payload['updated_at'] = new Date();
      payload['is_active'] = 1;
      payload['is_delete'] = 0;      
      const createdEntity = new this.model(payload);
      const result = await createdEntity.save();
      return new Response(true, StatusCodes.CREATED, CustomMessages.ENTRY_CREATED_SUCCESSFULLY, result);
    } catch(err){
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  async update(id, entity) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException(`Invalid ID format: ${id}`);
      }
      const result =  await this.model.findOne({ _id: id });
      if (!result) {
        return new Response(false, StatusCodes.BAD_REQUEST, CustomMessages.ENTRY_NOT_PRESENT, {});
      } else {
        entity['updated_at'] = new Date();
        const result = await this.model.findByIdAndUpdate(id, entity, { new: true }).exec();
        return new Response(true, StatusCodes.OK, CustomMessages.ENTRY_UPDATED_SUCCESSFULLY, result);
      }  
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    } 
  }

  async delete(id){
    try {
      const result =  await this.model.findOne({ _id: id });
      if (!result) {
        return new Response(false, StatusCodes.BAD_REQUEST, CustomMessages.ENTRY_NOT_PRESENT, {});
      } else {
        const result = await this.model.deleteOne({ _id: id }).exec();
        return new Response(true, StatusCodes.OK, CustomMessages.SUCCESS, {});
      }

    }catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
    
  }
}
