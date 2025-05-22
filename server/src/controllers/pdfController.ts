import { Request, Response } from 'express';

export const exportPDF = async (req: Request, res: Response) => {
    // TODO: Implement PDF generation
    res.status(501).json({ error: 'PDF generation not implemented' });
};