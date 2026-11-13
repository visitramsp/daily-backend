import {Task} from '../models/Task.js';
export const taskRepository={
 list:(filter,{page,limit})=>Task.find(filter).sort({dueAt:1,_id:1}).skip((page-1)*limit).limit(limit).lean(),
 count:filter=>Task.countDocuments(filter),
 find:id=>Task.findById(id),
 create:data=>Task.create(data),
 update:(id,data)=>Task.findByIdAndUpdate(id,{$set:data},{new:true,runValidators:true}),
 remove:id=>Task.findByIdAndDelete(id)
};
