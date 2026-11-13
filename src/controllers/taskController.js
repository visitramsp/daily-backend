import { asyncHandler } from '../middleware/errorHandler.js';
import { taskService } from '../services/taskService.js';
import { validate, createTaskSchema, updateTaskSchema, listTaskSchema } from '../utils/validation.js';
export const listTasks = asyncHandler(async (req, res) => res.json(await taskService.list(validate(listTaskSchema, req.query))));
export const getTask = asyncHandler(async (req, res) => res.json({ task: await taskService.find(req.params.id) }));
export const createTask = asyncHandler(async (req, res) => res.status(201).json({ task: await taskService.create(validate(createTaskSchema, req.body)) }));
export const updateTask = asyncHandler(async (req, res) => res.json({ task: await taskService.update(req.params.id, validate(updateTaskSchema, req.body)) }));
export const deleteTask = asyncHandler(async (req, res) => { await taskService.remove(req.params.id); res.status(204).send(); });
