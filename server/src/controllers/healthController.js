export const getHealth = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'TTDYATRA API is running properly.',
    timestamp: new Date().toISOString(),
  });
};
