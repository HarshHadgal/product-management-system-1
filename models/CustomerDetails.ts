import mongoose from 'mongoose';

const customerDetailsSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  tractorInfo: {
    serialNo: {
      type: String,
      required: true,
      trim: true
    },
    chasisNo: {
      type: String,
      required: true,
      trim: true
    },
    engineNumber: {
      type: String,
      required: true,
      trim: true
    },
    variant: {
      type: String,
      required: true,
      trim: true
    },
    model: {
      type: String,
      required: true,
      trim: true
    },
    productionDate: {
      type: Date,
      required: true
    },
    deliveryDate: {
      type: Date,
      required: true
    },
    deliveredBy: {
      type: String,
      required: true,
      trim: true
    },
    installationDate: {
      type: Date,
      required: true
    },
    warrantyUpto: {
      type: Date,
      required: true
    }
  },
  serviceInfo: {
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    mobileNumber: {
      type: String,
      required: true,
      validate: {
        validator: function(v: string) {
          return /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid 10-digit mobile number!`
      }
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function(v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      trim: true
    },
    tehsil: {
      type: String,
      required: true,
      trim: true
    },
    village: {
      type: String,
      required: true,
      trim: true
    }
  },
  additionalInfo: {
    complaints: {
      type: String,
      required: false,
      trim: true
    },
    res: {
      type: String,
      required: false,
      trim: true
    },
    observation: {
      type: String,
      required: false,
      trim: true
    },
    description: {
      type: String,
      required: false,
      trim: true
    },
    parts: {
      type: String,
      required: false,
      trim: true
    }
  }
}, {
  timestamps: true
});

const CustomerDetails = mongoose.models.CustomerDetails || mongoose.model('CustomerDetails', customerDetailsSchema);

export default CustomerDetails; 