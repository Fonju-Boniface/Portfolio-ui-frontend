"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ref, push } from "firebase/database";
import { database } from "../../firebase"; // Adjust the path as needed
import { Button } from "@/components/ui/button";

const ContactForm = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryCode, setCountryCode] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    country: false,
    phone: false,
    message: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryData = response.data
          .map((country) => ({
            name: country.name.common,
            code:
              country.idd.root +
              (country.idd.suffixes ? country.idd.suffixes[0] : ""),
            flag: country.flags.svg,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryChange = (e) => {
    const country = countries.find((c) => c.name === e.target.value);
    setSelectedCountry(country);
    setCountryCode(country ? country.code : "");
    setFormData((data) => ({
      ...data,
      phone: country ? `${country.code} ${data.phone.replace(country.code, "").trim()}` : data.phone,
    }));
    setFormErrors((errors) => ({ ...errors, country: !country }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
    setFormErrors((errors) => ({ ...errors, [name]: !value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const errors = {
      firstName: !formData.firstName,
      lastName: !formData.lastName,
      email: !formData.email || !isValidEmail(formData.email),
      country: !selectedCountry,
      phone: !formData.phone,
      message: !formData.message,
    };

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    setSubmitting(true);

    // Remove spaces from phone number
    const sanitizedPhone = formData.phone.replace(/\s+/g, '');

    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      country: selectedCountry.name,
      phone: sanitizedPhone, // Use sanitized phone number
      message: formData.message,
      timestamp: new Date().toISOString(), // Add the current timestamp
    };

    try {
      const contactRef = ref(database, "contacts");
      await push(contactRef, data);
      setNotification("Form submitted successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
      setSelectedCountry(null);
      setCountryCode("");
    } catch (error) {
      setNotification("Failed to submit form. Please try again later.");
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="max-w-2xl mx-auto p-1 sm:p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6">Contact Me</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name */}
        <div className="flex flex-col">
          <label htmlFor="firstName" className="font-semibold mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`p-2 border rounded-md border-gray-300
              bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
              dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static
              lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 ${formErrors.firstName ? "border-red-500" : ""}`}
            placeholder="Enter your first name"
            required
          />
          {formErrors.firstName && <small className="text-red-500">First Name is required</small>}
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label htmlFor="lastName" className="font-semibold mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`p-2 border rounded-md border-gray-300
              bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
              dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static
              lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 ${formErrors.lastName ? "border-red-500" : ""}`}
            placeholder="Enter your last name"
            required
          />
          {formErrors.lastName && <small className="text-red-500">Last Name is required</small>}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`p-2 border rounded-md border-gray-300
              bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
              dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static
              lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 ${formErrors.email ? "border-red-500" : ""}`}
            placeholder="Enter your email"
            required
          />
          {formErrors.email && <small className="text-red-500">Please enter a valid email address</small>}
        </div>

        {/* Country */}
        <div className="flex flex-col">
          <label htmlFor="country" className="font-semibold mb-1">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={selectedCountry ? selectedCountry.name : ""}
            onChange={handleCountryChange}
            className={`p-2 border rounded-md border-gray-300
              bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
              dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static
              lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 ${formErrors.country ? "border-red-500" : ""}`}
            required
          >
            <option value="">Select your country</option>
            {countries.map((country) => (
              <option  key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {formErrors.country && <small className="text-red-500">Country is required</small>}
        </div>

        {/* Phone */}
        {/* Phone */}
<div className="flex flex-col w-full">
  <label htmlFor="phone" className="font-semibold mb-1">
    Phone
  </label>
  <div className="relative w-full">
    <input
      type="tel"
      id="phone"
      name="phone"
      value={formData.phone}
      onChange={handleInputChange}
      className={`border rounded-md pl-16 border-gray-300 flex justify-center
        bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
        dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static
        lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 ${formErrors.phone ? "border-red-500" : ""}`}
      placeholder="Enter your phone number"
      required
    />
    <span className="absolute left-0 pl-5 top-1/2 transform -translate-y-1/2 bg-primary h-full flex justify-center items-center">
      {countryCode}
    </span>
  </div>
  {formErrors.phone && <small className="text-red-500">Phone is required</small>}
</div>

        {/* Message */}
        <div className="flex flex-col">
          <label htmlFor="message" className="font-semibold mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={`p-2 border rounded-md border-gray-300
              bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
              dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static
              lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 ${formErrors.message ? "border-red-500" : ""}`}
            placeholder="Type your message"
            required
          />
          {formErrors.message && <small className="text-red-500">Message is required</small>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button type="submit" disabled={submitting} className="w-full mt-4">
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </div>

        {/* Notification */}
        {notification && <p className="mt-4 text-green-500">{notification}</p>}
      </form>
    </div>
  );
};

export default ContactForm;
