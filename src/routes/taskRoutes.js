import { Router } from 'express';
import { listTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
const router = Router();
router.get('/', listTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
export default router;
