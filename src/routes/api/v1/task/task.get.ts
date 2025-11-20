import * as Boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import CustomLogger from '../../../../common/custom-logger';
import { ErrorMessage } from '../../../../common/enum/errors.enum';
import tasksDAO from '../../../../dao/tasks';
import { HttpStatus } from './../../../../common/enum/http-status.enum';

async function getAllTasksService(req: Request, res: Response, next: NextFunction) {
  const {
    query: { offset, limit },
  } = req;

  try {
    // validate numeric values
    const parsedOffset = offset ? Number(offset) : undefined;
    const parsedLimit = limit ? Number(limit) : undefined;

    if ((offset && isNaN(parsedOffset)) || (limit && isNaN(parsedLimit))) {
      return next(Boom.badRequest('offset and limit must be numeric values'));
    }

    const tasks = await tasksDAO.getAll({
      offset: parsedOffset,
      limit: parsedLimit,
    });

    return res.status(HttpStatus.OK).send(tasks);
  } catch (e) {
    CustomLogger.error(`[getAllTasksService] ${e}`);
    return next(Boom.badRequest(e));
  }
}

async function getTaskByIdService(req: Request, res: Response, next: NextFunction) {
  const {
    params: { id },
  } = req;

  try {
    // id numeric validation
    if (isNaN(Number(id))) {
      return next(Boom.badRequest('id must be a numeric value'));
    }

    const task = await tasksDAO.getById(Number(id));

    if (!task) {
      return next(Boom.notFound(ErrorMessage.NOT_FOUND_ERROR));
    }

    return res.status(HttpStatus.OK).send(task);
  } catch (e) {
    CustomLogger.error(`[getTaskByIdService] ${e}`);
    return next(Boom.badRequest(e));
  }
}

async function getHeightPriorityTaskService(req: Request, res: Response, next: NextFunction) {
  try {
    const heightPriorityTask = await tasksDAO.getHeightPriority();

    if (!heightPriorityTask) {
      return next(Boom.notFound(ErrorMessage.NOT_FOUND_ERROR));
    }

    return res.status(HttpStatus.OK).send(heightPriorityTask);
  } catch (e) {
    CustomLogger.error(`[getHeightPriorityTaskService] ${e}`);
    return next(Boom.badRequest(e));
  }
}

export default {
  getAllTasksService,
  getTaskByIdService,
  getHeightPriorityTaskService,
};
