import { updateDeviceWeightService } from "../services/device.service.js";

export const updateWeight = async (req, res) => {
  try {
    const { deviceId, weight } = req.body;

    const { isFirstTime, data } =
    await updateDeviceWeightService({ deviceId, weight });
    res.status(isFirstTime ? 201 : 200).json({
      success: true,
      message: isFirstTime
        ? "Device registered and weight stored"
        : "Weight updated successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
