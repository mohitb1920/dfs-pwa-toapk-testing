export const schemeHeader = "PRADHAN MANTRI KISAN SAMMAN NISDHI(PM-KISAN)";
export const aboutScheme =
  "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.";

export const schemeBenefits =
  "Under the PM-KISAN scheme, all landholding farmers' families shall be provided the financial benefit of Rs. 6000 per annum per family payable in three equal installments of Rs. 2000 each, every four months.";

export const schemeEligibility =
  "Rorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.";

export const farmerSchemesList = [
  {
    title: "PM Kisan Samridhi Yojana (PMKSY)",
    date: "12-04-2024",
    summary:
      "The Government has decided to achieve ‘More harvest per drop’ in an engaging way with start to finish arrangement on source creation, distribution, the board, field application and development exercises for farmers.",
  },
  {
    title: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    date: "08-08-2014",
    summary:
      "The Government has decided to achieve ‘More harvest per drop’ in an engaging way with start to finish arrangement on source creation, distribution, the board, field application and development exercises for farmers.",
  },
  {
    title: "Swachh Bharat Abhiyan (SBHA)",
    date: "02-10-2014",
    summary:
      "The Government has decided to achieve ‘More harvest per drop’ in an engaging way with start to finish arrangement on source creation, distribution, the board, field application and development exercises for farmers.",
  },
  {
    title: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (ABPMJAY)",
    date: "23-09-2018",
    summary:
      "The Government has decided to achieve ‘More harvest per drop’ in an engaging way with start to finish arrangement on source creation, distribution, the board, field application and development exercises for farmers.",
  },
  {
    title: "Atal Pension Yojana (APY)",
    date: "09-05-2015",
    summary:
      "The Government has decided to achieve ‘More harvest per drop’ in an engaging way with start to finish arrangement on source creation, distribution, the board, field application and development exercises for farmers.",
  },
  {
    title: "Swachh Bharat Abhiyan (SBHA)",
    date: "02-10-2014",
    summary:
      "The Government has decided to achieve ‘More harvest per drop’ in an engaging way with start to finish arrangement on source creation, distribution, the board, field application and development exercises for farmers.",
  },
  {
    title: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (ABPMJAY)",
    date: "23-09-2018",
    summary:
      "The Government has decided to achieve ‘More harvest per drop’ in an engaging way with start to finish arrangement on source creation, distribution, the board, field application and development exercises for farmers.",
  },
  {
    title: "Atal Pension Yojana (APY)",
    date: "09-05-2015",
    summary:
      "The Government has decided to achieve ‘More harvest per drop’ in an engaging way with start to finish arrangement on source creation, distribution, the board, field application and development exercises for farmers.",
  },
];
export const dummySchema = {
  title: "A registration form",
  type: "object",
  required: ["firstName", "lastName", "dob"],
  properties: {
    firstName: {
      type: "string",
      title: "First name",
      default: "Pavan",
    },
    lastName: {
      type: "string",
      title: "Last name",
    },
    age: {
      type: "integer",
      title: "Age",
    },
    bio: {
      type: "string",
      title: "Bio",
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 3,
    },
    dob: {
      type: "string",
      format: "date",
      title: "Date Of Birth",
    },
    sex: {
      title: "Sex",
      enum: ["Male", "Female", "Other"],
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10,
      maxLength: 10,
    },
    photo: {
      type: "string",
      format: "data-url",
      title: "Pass Photo",
    },
  },
};

export const existingSchema = {
  type: "object",
  properties: {
    "Scheme Name": {
      type: "string",
      title: "Scheme Name",
    },
    "Scheme Component": {
      type: "string",
      title: "Scheme Component",
    },
    "Financial Year": {
      type: "string",
      title: "Financial Year",
    },
    personalInformation: {
      type: "object",
      title: "Personal Information",
      required: ["farmerName", "farmerDOB", "farmerGender"],
      properties: {
        farmerName: {
          type: "string",
          title: "Farmer Name",
        },
        farmerDOB: {
          type: "string",
          format: "date",
          title: "Date of Birth",
        },
        farmerRelativeName: {
          type: "string",
          title: "Relative Name",
        },
        farmerGender: {
          title: "Gender",
          enum: ["Male", "Female", "Other"],
        },
        farmerMaritalStatus: {
          title: "Marital Status",
          enum: ["Married", "Unmarried"],
        },
        FarmerCasteCategory: {
          type: "string",
          title: "Caste Category",
          enum: ["ST", "SC", "BC", "OC", "OBC"],
        },
        FarmerCategory: {
          type: "string",
          title: "Category",
        },
        dBTRegistrationNumber: {
          type: "string",
          title: "DBT Registration Number",
        },
        farmerAadhaarNumber: {
          type: "string",
          title: "Aadhaar Number",
        },
        FarmerMobileNumber: {
          type: "string",
          title: "Mobile Number",
        },
        FarmerType: {
          type: "string",
          title: "Farmer Type",
        },
      },
    },
    locationInformation: {
      type: "object",
      title: "Location Information",
      required: ["FarmerDistrict", "FarmerVillage"],
      properties: {
        FarmerDistrict: {
          type: "string",
          title: "District",
        },
        FarmerBlock: {
          type: "string",
          title: "Block",
        },
        FarmerGraPanchayat: {
          type: "string",
          title: "Gram Panchayat",
        },
        FarmerVillage: {
          type: "string",
          title: "Village",
        },
      },
    },
    cropDetails: {
      type: "object",
      title: "Crop Details",
      required: ["Crop", "CropType", "CropRate"],
      properties: {
        Crop: {
          type: "string",
          title: "Crop",
        },
        CropType: {
          type: "string",
          title: "Crop Type",
        },
        CropQuantity: {
          type: "string",
          title: "Crop Quantity",
        },
        CropRate: {
          type: "string",
          title: "Crop Rate",
        },
        SeedAmount: {
          type: "string",
          title: "Seed Amount",
        },
        Grant: {
          type: "string",
          title: "Grant",
        },
        GrantAmount: {
          type: "string",
          title: "Grant Amount",
        },
        DueAmount: {
          type: "string",
          title: "Due Amount",
        },
        Homedeliverycharges: {
          type: "string",
          title: "Home Delivery Charges",
        },
      },
    },
    landDetails: {
      type: "object",
      title: "Land Details",
      required: ["FarmerLandDistrict", "FarmerLandRevenueZone"],
      properties: {
        FarmerLandRevenueZone: {
          type: "string",
          title: "Revenue Zone",
        },
        FarmerLandDistrict: {
          type: "string",
          title: "Land District",
        },
        "FarmerLand(Halka)": {
          type: "string",
          title: "Halka",
        },
        "FarmerLand(Mauja)": {
          type: "string",
          title: "Mauja",
        },
        FarmerLandRegistrationPartNumber: {
          type: "string",
          title: "Registration Part Number",
        },
        FarmerLandRegistrationPageNumber: {
          type: "string",
          title: "Registration Page Number",
        },
        FarmerLandRegistrationDate: {
          type: "string",
          title: "Registration Date",
        },
      },
    },
    bankInformation: {
      type: "object",
      title: "Bank Information",
      required: ["FarmerBank", "FarmerBankIFSC", "FarmerAccountNumber"],
      properties: {
        FarmerBank: {
          type: "string",
          title: "Bank Name",
        },
        FarmerBankIFSC: {
          type: "string",
          title: "Bank IFSC",
        },
        FarmerAccountNumber: {
          type: "string",
          title: "Account Number",
        },
      },
    },
  },
};

//--> Normal Forms Creation  <--//

// const {
//   register,
//   handleSubmit,
//   watch,
//   formState: { errors },
// } = useForm();

// const inputForm = (input) => {
//   const { field, label, required, pattern, type, dropdownOptions } = input;
//   switch (type) {
//     case "text":
//       return (
//         <>
//           <TextField
//             {...register(field, {
//               required: required,
//               pattern: pattern,
//             })}
//             required
//             id="outlined-required"
//             label={label}
//             sx={{ width: "200px", marginBottom: 2 }}
//           />
//           {errors[field]?.type === "required" && (
//             <p>This field is required</p>
//           )}
//           {errors[field]?.type === "pattern" && (
//             <p>Alphabetical characters only</p>
//           )}
//         </>
//       );
//     case "date":
//       return (
//         <>
//           <LocalizationProvider dateAdapter={AdapterMoment}>
//             <InputLabel sx={{ fontSize: 15 }}>
//               {label}
//               {required && <span className="required-field">*</span>}
//             </InputLabel>
//             <DatePicker
//               format="DD MMMM, YYYY"
//               sx={{ width: "200px", mb: 2, background: "#ffff" }}
//             />
//           </LocalizationProvider>
//         </>
//       );
//     case "dropdown":
//       return (
//         <>
//           <InputLabel sx={{ fontSize: 15 }}>
//             {label}
//             {required && <span className="required-field">*</span>}
//           </InputLabel>
//           <Select sx={{ width: "200px", marginBottom: "15px" }}>
//             {dropdownOptions?.map((dropdown) => (
//               <MenuItem value={dropdown?.value} dropdown={dropdown}>
//                 {dropdown?.label}
//               </MenuItem>
//             ))}
//           </Select>
//         </>
//       );
//     default:
//       return <></>;
//   }
// };

export const personalDetailsFormFields = [
  {
    field: "fullName",
    label: "किसान का नाम (आधार के अनुसार)",
    required: true,
    pattern: /^[A-Za-z]+$/i,
    type: "text",
    group: false,
  },
  {
    field: "dateOfBirth",
    label: "किसान का_ जन्म तिथि",
    required: true,
    pattern: /^[A-Za-z]+$/i,
    type: "date",
    group: true,
  },
  {
    field: "age",
    label: "वर्तमान उम्र (साल में)",
    required: true,
    pattern: /^[A-Za-z]+$/i,
    type: "number",
    group: true,
  },
  {
    field: "sex",
    label: "किसान का_ लिंग",
    required: true,
    dropdownOptions: [
      { label: "Male", value: "M" },
      { label: "Female", value: "F" },
      { label: "Others", value: "O" },
    ],
    type: "dropdown",
    group: false,
  },
  {
    field: "maritalStatus",
    label: "किसान की वैवाहिक स्थिति",
    required: true,
    dropdownOptions: [
      { label: "Single", value: "single" },
      { label: "Married", value: "married" },
    ],
    type: "dropdown",
    group: true,
  },
  {
    field: "fatherName",
    label: "किसान का  पिता/माँ/पति का नाम",
    required: true,
    pattern: /^[A-Za-z]+$/i,
    type: "text",
    group: true,
  },
  {
    field: "mobileNumber",
    label: "किसान का_ मोबाइल संख्या",
    required: true,
    pattern: /^[A-Za-z]+$/i,
    type: "phone",
    group: true,
  },
  {
    field: "typeOfFarmer",
    label: "किसान का प्रकार",
    required: true,
    pattern: /^[A-Za-z]+$/i,
    type: "text",
    group: true,
  },
  {
    field: "adharNumber",
    label: "किसान का आधार संख्या",
    required: true,
    pattern: /^[A-Za-z]+$/i,
    type: "adhar",
    group: true,
  },
  {
    field: "category",
    label: "किसान का_ श्रेणी",
    required: true,
    dropdownOptions: [
      { label: "ST", value: "ST" },
      { label: "SC", value: "SC" },
      { label: "BC", value: "BC" },
      { label: "OC", value: "OC" },
      { label: "OBC", value: "OBC" },
    ],
    type: "dropdown",
    group: true,
  },
];

export const acceptedFileTypes = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "application/zip",
];
export const citizenEmployeeActions = [
  "APPLY",
  "ASSIGN",
  "RESOLVE",
  "ESCALATE",
  "REOPEN",
  "REASSIGN",
  "VERIFY",
  "RESOLVE-KCC",
];
export const employeeActions = ["RESOLVE", "ESCALATE", "VERIFY", "RESOLVE-KCC"];
export const citizenActions = ["APPLY"];
export const TENANT_ID = "br";
