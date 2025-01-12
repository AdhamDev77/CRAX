/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { ComponentConfig } from "../../../packages/core";
import { X, Brush } from "lucide-react";
import ColorPicker from "react-pick-color";
import { useParams } from "next/navigation";
import axios from "axios";
import { Label } from "recharts";
import ColorPickerComponent from "@/components/ColorPicker";
// import { CoolSpan } from "@/components/CoolSpan";

export type InputFieldConfig = {
  name: string;
  type: "text" | "number" | "email" | "textarea" | "checkbox" | "date";
  required: boolean;
};

export type ContactFormProps = {
  bgColor: string;
  bgFormColor: string;
  fontColor: string;
  bgBtnColor: string;
  btnColor: string;
  formTitle: string;
  formBtnTitle: string;
  formNote: string;
  formSuccessMessage: string;
  FormspreeID: string;
  inputFields: InputFieldConfig[];
};

export const ContactForm: ComponentConfig<ContactFormProps> = {
  // label: <div className="flex w-full justify-between items-center">Form <CoolSpan text="Lead Generation" /></div>,
  label: "Leads Form",
  fields: {
    FormspreeID: { section: "content", type: "text" },
    formTitle: { section: "content", type: "text" },
    inputFields: {
      section: "content",
      type: "array",
      label: "Input Fields",
      getItemSummary: (item) => `${item.name} (${item.type})`,
      arrayFields: {
        name: { type: "text", label: "Field Label" },
        type: {
          type: "select",
          label: "Field Type",
          options: [
            { label: "Text", value: "text" },
            { label: "Number", value: "number" },
            { label: "Email", value: "email" },
            { label: "Text Area", value: "textarea" },
            { label: "checkbox", value: "checkbox" },
            { label: "Date", value: "date" },
          ],
        },
        required: {
          type: "select",
          options: [
            { label: "Required", value: true },
            { label: "Optional", value: false },
          ],
          label: "Required Field",
        },
      },
    },
    formBtnTitle: {section: "content", type: "text" },
    formNote: {section: "content", type: "text" },
    formSuccessMessage: {section: "content", type: "text" },
    bgColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <ColorPickerComponent name={name} onChange={onChange} value={value} />
        );
      },
    },
    bgFormColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <ColorPickerComponent name={name} onChange={onChange} value={value} />
        );
      },
    },
    fontColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <ColorPickerComponent name={name} onChange={onChange} value={value} />
        );
      },
    },
    bgBtnColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <ColorPickerComponent name={name} onChange={onChange} value={value} />
        );
      },
    },
    btnColor: {
      type: "custom",
      render: ({ name, onChange, value }) => {
        return (
          <ColorPickerComponent name={name} onChange={onChange} value={value} />
        );
      },
    },
  },
  defaultProps: {
    formTitle: "Contact us",
    formBtnTitle: "Send Message",
    formNote: "We'll get back to you in 1-2 business days.",
    formSuccessMessage:
      "Message sent successfully! We'll get back to you soon.",
    bgColor: "#ffffff",
    bgFormColor: "#ffffff",
    fontColor: "#000000",
    bgBtnColor: "#2563eb",
    btnColor: "#ffffff",
    inputFields: [
      { name: "First Name", type: "text", required: true },
      { name: "Last Name", type: "text", required: true },
      { name: "Email", type: "email", required: true },
      { name: "Phone Number", type: "text", required: false },
      { name: "Birth Date", type: "date", required: false },
      { name: "Subscribe to Newsletter", type: "checkbox", required: false },
    ],
    FormspreeID: "mdkoagwk",
  },
  render: ({
    FormspreeID,
    inputFields,
    formTitle,
    formBtnTitle,
    formNote,
    formSuccessMessage,
    bgColor,
    bgFormColor,
    fontColor,
    bgBtnColor,
    btnColor,
  }: ContactFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState("");
    const params = useParams();

    function toCamelCase(label: string) {
      if (label && label.length > 0) {
        return label
          .toLowerCase()
          .split(" ")
          .map((word, index) =>
            index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join("");
      }
      return "";
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus("");

      try {
        const form = e.currentTarget;
        const formData = new FormData(form);

        // Create an object for the leads API
        const leadsData: Record<string, any> = {};

        // Process each input field
        inputFields.forEach((field) => {
          const fieldId = toCamelCase(field.name);
          if (!fieldId) return;

          if (field.type === "checkbox") {
            // For checkbox, we need to check if it's checked
            const isChecked = formData.get(fieldId) === "on";
            leadsData[fieldId] = isChecked;
            // Update formData for Formspree to handle checkbox properly
            if (isChecked) {
              formData.set(fieldId, "yes");
            } else {
              formData.set(fieldId, "no");
            }
          } else {
            // For all other field types
            const value = formData.get(fieldId);
            leadsData[fieldId] = value || ""; // Ensure we always have a value
          }
        });

        // Send to both Formspree and leads API
        const dataObject = Object.fromEntries(formData.entries());
        const [formspreeResponse, apiResponse] = await Promise.all([
          fetch(`https://formspree.io/f/${FormspreeID}`, {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
          }),

          axios.post(`/api/site/${params.sitePath}/leads`, leadsData),
        ]);

        if (formspreeResponse.ok && apiResponse.status === 200) {
          setSubmitStatus("success");
          form.reset();
        } else {
          setSubmitStatus("error");
          console.error("Form submission failed", {
            formspreeResponse,
            apiResponse,
          });
        }
      } catch (error) {
        console.error("Submission error:", error);
        setSubmitStatus("error");
      }

      setIsSubmitting(false);
    };

    const renderFormField = (field: InputFieldConfig) => {
      const fieldId = toCamelCase(field.name);
      const commonProps = {
        id: fieldId,
        name: fieldId,
        required: field.required,
        className:
          "py-3 px-4 block w-full border border-gray-600/15 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none",
      };

      switch (field.type) {
        case "textarea":
          return <textarea {...commonProps} rows={4} />;
        case "checkbox":
          return (
            <input
              type="checkbox"
              {...commonProps}
              className="h-4 w-4 rounded border-gray-300"
            />
          );
        case "date":
          return <input type="date" {...commonProps} />;
        default:
          return <input type={field.type} {...commonProps} />;
      }
    };

    return (
      <div
        className="px-4 sm:px-6 lg:px-8 mx-auto"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-lg mx-auto">
          <div
            className="flex flex-col rounded-xl p-4 sm:p-6 lg:p-8"
            style={{ backgroundColor: bgFormColor }}
          >
            <h2
              className="mb-8 text-xl font-semibold"
              style={{ color: fontColor }}
            >
              {formTitle}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 lg:gap-6">
                {inputFields.map((field, index) => (
                  <div
                    key={index}
                    className={
                      field.type === "checkbox" ? "flex items-center gap-2" : ""
                    }
                  >
                    <label
                      htmlFor={toCamelCase(field.name)}
                      className={`${
                        field.type === "checkbox" ? "order-2" : "block mb-2"
                      } text-sm font-medium`}
                      style={{ color: fontColor }}
                    >
                      {field.name}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {renderFormField(field)}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                  style={{ backgroundColor: bgBtnColor, color: btnColor }}
                >
                  {isSubmitting ? "Sending..." : formBtnTitle}
                </button>
              </div>

              {submitStatus === "success" && (
                <div className="mt-3 text-center text-green-500">
                  {formSuccessMessage}
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mt-3 text-center text-red-600">
                  There was an error sending your message. Please try again.
                </div>
              )}

              {!submitStatus && (
                <div className="mt-3 text-center">
                  <p className="text-sm" style={{ color: fontColor }}>
                    {formNote}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  },
};
