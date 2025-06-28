import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: error.message
    });
  }

  if (error.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      error: 'Database Error',
      details: 'Invalid request to database'
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    details: `Route ${req.originalUrl} not found`
  });
}; 