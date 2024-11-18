import axios from "axios";
import { useEffect, useState } from "react";
import * as yup from 'yup';

// this is where I define what I want my formValues object to look like
const schema = yup.object().shape({
  fullName: yup
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(20, 'Full name must be at most 20 characters')
    .required('Full name is required'),
  shirtSize: yup
    .string()
    .oneOf(['S', 'M', 'L'], 'Shirt size must be one of the following: S, M, L')
    .required('Shirt size is required'),
});

// this is what I want my form to be collecting
const initialFormValues = {
  fullName: "",
  shirtSize: "",
  animalIds: [],
};

// these are the error messages for the property listed that our schema will give to use when validating against values in our formValues object
const initialErrors = {
  fullName: "",
  shirtSize: "",
};

// this is a list of animal objects that we will be using to dynmiacally show our checkbox inputs
const animals = [
  { animal_id: "1", animal_name: "cat" },
  { animal_id: "2", animal_name: "dog" },
  { animal_id: "3", animal_name: "bird" },
  { animal_id: "4", animal_name: "fish" },
];

export const Information = () => {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState(initialErrors);
  const [isDisabled, setIsDisabled] = useState(true);
  const [message, setMessage] = useState('');

  // grabbing the name and value properties (what their values are) off the events target (the input we interacted with)
  // then we are updating whatever property name is equal to on formValues state
  // we are validating the value that came from the event against the schema for what property name is equal to
  const handleTextChange = (e) => {
    const {name, value} = e.target;
    setFormValues({...formValues, [name]: value})

    yup.reach(schema, name).validate(value)
        .then(() => setErrors({...errors, [name]: ''}))
        .catch((error) => setErrors({...errors, [name]: error.errors[0]}))
  }

  // we are taking in if the item was checked (or unchecked), and what item was checked (or unchecked) from our events target
  // if we are checking on the item we will add that item to the end of our formValues object animals array
  // if we are unchecking then we remove that item from our formValues animals array
  const handleCheckboxChange = (e) => {
    const {checked, name} = e.target;
    if (checked) {
        setFormValues({...formValues, animals: [...formValues.animals, name]});
    } else {
        setFormValues({...formValues, animals: formValues.animals.filter(aId => aId !== name)});
    }
  }

  // we reach out to our backend and we send a post request with the current state of our formValues
  // when we get the response back, we just take the data property, we then take the message property off of that object
  // and we update our message to be what it is equal to
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {data: response} = await axios.post('http://localhost:9000/form-submision', formValues);
    setMessage(response.message);
  }

  // everytime our formValues are update, we check to see if our formValues object is valid
  // against our schema, and if it is, we set isDisabled to false, otherwise we set it to true
  useEffect(() => {
    schema.isValid(formValues).then(valid => setIsDisabled(!valid));
  }, [formValues])

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg space-y-6">
      {message && <p className="text-center text-green-600 font-semibold">{message}</p>}
      <div>
        <input 
          value={formValues.fullName} 
          name="fullName" 
          onChange={handleTextChange} 
          placeholder="Full Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
      </div>
      <div>
        <select 
          value={formValues.shirtSize} 
          name="shirtSize" 
          onChange={handleTextChange} 
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        >
          <option value="">Select Size</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {errors.shirtSize && <p className="text-red-500 text-sm">{errors.shirtSize}</p>}
      </div>
      <div className="space-y-2">
        {animals.map((animal) => (
          <div key={animal.animal_id} className="flex items-center">
            <input 
              onChange={handleCheckboxChange} 
              name={animal.animal_id} 
              checked={formValues.animals.includes(animal.animal_id)} 
              type="checkbox" 
              className="mr-2"
            />
            <label>{animal.animal_name}</label>
          </div>
        ))}
      </div>
      <button 
        disabled={isDisabled} 
        className={`w-full py-2 px-4 font-semibold rounded-md text-white ${
          isDisabled ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Submit
      </button>
    </form>
  );
};
