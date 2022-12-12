import { Request, Response } from 'express';

import Random from '../models/random';

export const getCollectiveClicks = (req: Request, res: Response) => {
  console.log('Getting collective counter clicks');

  Random.findOne()
    .exec()
    .then((results) => {
      return res.status(200).json({ clicks: results?.collectiveCounterClicks });
    })
    .catch((err: any) => res.status(500).json({ message: err.message }));
};

export const incrementButtonClicks = (req: Request, res: Response) => {
  Random.findOne()
    .exec()
    .then((results) => {
      let newClicks = Number(results?.collectiveCounterClicks) + 1;

      console.log(`Incrementing collective counter clicks to ${newClicks}`);

      Random.updateOne({}, { collectiveCounterClicks: newClicks })
        .then(() => {
          return res.status(200).json({ clicks: newClicks });
        })
        .catch((err: any) => res.status(500).json({ message: err.message }));
    })
    .catch((err: any) => res.status(500).json({ message: err.message }));
};
