import mongoose from 'mongoose';

const engineSchema = new mongoose.Schema({
  engine_model: { type: String, required: true },
  engine_serial_number: { type: String, required: true },
  alternator_serial_number: { type: String, required: true },
  alternator_kva: { type: Number, required: true },
  alternator_make: { type: String, required: true },
  customer_name: { type: String, required: true },
  customer_address: { type: String, required: true },
  parameters: {
    voltage: { type: Number, required: true },
    kw: { type: Number, required: true },
    pf: { type: Number, required: true },
    amps: { type: Number, required: true },
    water_temp: { type: Number, required: true },
    lube_oil_temp: { type: Number, required: true },
    lube_oil_pressure: { type: Number, required: true },
    running_hours: { type: Number, required: true },
    latest_meter_reading: { type: Number, required: true }
  },
  description: { type: String, required: true },
  parts_replaced: { type: String },
  recommendation: { type: String },
  complaints: { type: String },
  employee_serial_number: { type: String, required: true },
  employee_serial_alias: { type: String },
  date_of_fill: { type: Date, default: Date.now }
});

export default mongoose.models.Engine || mongoose.model('Engine', engineSchema); 