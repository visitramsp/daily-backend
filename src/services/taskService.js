import mongoose from 'mongoose';
import {taskRepository} from '../repositories/taskRepository.js';
function problem(message,status){return Object.assign(new Error(message),{status});}
function validId(id){if(!mongoose.isValidObjectId(id))throw problem('Invalid task ID',400);return id;}
function regexEscape(value){return value.replace(/[^a-zA-Z0-9 ]/g,character=>'\\'+character);}
function filterFromQuery(query){
 const filter={};
 if(query.search){const pattern=new RegExp(regexEscape(query.search),'i');filter.$or=[{title:pattern},{description:pattern}];}
 if(query.status)filter.status=query.status;
 if(query.priority)filter.priority=query.priority;
 if(query.from||query.to){filter.dueAt={};if(query.from)filter.dueAt.$gte=new Date(query.from);if(query.to)filter.dueAt.$lt=new Date(query.to);}
 return filter;
}
async function found(promise){const task=await promise;if(!task)throw problem('Task not found',404);return task;}
export const taskService={
 async list(query){const filter=filterFromQuery(query);const [items,total]=await Promise.all([taskRepository.list(filter,query),taskRepository.count(filter)]);return{items,total,page:query.page,limit:query.limit,pages:Math.ceil(total/query.limit)};},
 find:id=>found(taskRepository.find(validId(id))),
 create:data=>taskRepository.create(data),
 update:(id,data)=>found(taskRepository.update(validId(id),data)),
 remove:id=>found(taskRepository.remove(validId(id)))
};
