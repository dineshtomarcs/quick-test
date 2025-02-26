import { t } from "i18next";
import * as yup from "yup";
import { ValidatorMessage } from "./constants/misc";

const passwordRegExp = /^[^ ]*$/;
const onlyNumber = /^[\d ]*$/;
const phoneNumber = /^[1-9][0-9]*$/;
const hasEmail = /^([\w\-+]|(?<!\.)\.)+[a-z0-9]@[a-z]+\.[a-z]{2,64}$/;
const hasWeb =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{1,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{1,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{1,}|www\.[a-zA-Z0-9]+\.[^\s]{1,}|[a-zA-Z0-9]+\.[^\s]{2,})/gi;

const hasNumber = /(\(\d{3}\))?[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}/gim;
const nameRegExp = /^(?=)[a-zA-Z æøåÆØÅ]+(?:[-' ][a-zA-Z æøåÆØÅ]+)*$/;
const phoneNumberRegExp = /^([+]\d{2})?\d{8}$/;
const hasOrganization = /^([a-zA-Z0-9 _-]+)$/;

export const validateRequiredEmail = () =>
  yup
    .string()
    .trim()
    .email(t(ValidatorMessage.EMAIL_NOT_VALID))
    .required(t(ValidatorMessage.EMAIL_REQ))
    .matches(hasEmail, t(ValidatorMessage.EMAIL_NOT_VALID));

export const titleSchema = () =>
  yup
    .string()
    .trim()
    .max(32, t(ValidatorMessage.FIRST_NAME_MAX_LENGTH))
    .required(t(ValidatorMessage.TITLE_REQ))
    .matches(/^(?=)[a-zA-Z0-9]+(?:[-' ][a-zA-Z0-9]+)*$/);

export const validateRequiredOrg = () =>
  yup
    .string()
    .trim()
    .matches(hasOrganization, t(ValidatorMessage.ORGANIZATION_NAME_NOT_VALID))
    .required(t(ValidatorMessage.ORGANIZATION_REQ));

export const validateRequiredPhone = () =>
  yup
    .string()
    .required(t("validation.phone.required"))
    .nullable()
    .matches(phoneNumber, t("validation.phone.invalid"))
    .matches(phoneNumberRegExp, t("validation.phone.invalid"));

export const validateRequiredPassword = () =>
  yup
    .string()
    .matches(passwordRegExp, "validation.password.invalid.space")
    .required(t(ValidatorMessage.PASS_REQ))
    .min(8, t(ValidatorMessage.PASS_MIN_LENGTH));

export const validateRequirementRequired = () =>
  yup
    .string()
    .matches(hasEmail, t("validation.password.invalid.space"))
    .matches(hasNumber, t("validation.password.invalid.space"))
    .matches(hasWeb, t("validation.password.invalid.space"))
    .min(8, t("validation.password.min"))
    .required(t("validation.password.required"));

export const validateRequiredConfirmPassword = () =>
  yup
    .string()
    .matches(passwordRegExp, t("validation.password.invalid.space"))
    .min(8, t("validation.password.min"))
    .required(t("validation.password.required"));

export const validateRequiredFirstName = () =>
  yup
    .string()
    .trim()
    .matches(/^\S*$/, t(ValidatorMessage.FIRST_NAME_SPACE_NOT_VALID))
    .matches(nameRegExp, t(ValidatorMessage.FIRST_NAME_NOT_VALID))
    .required(t(ValidatorMessage.FIRST_NAME_REQ))
    .max(32, t(ValidatorMessage.FIRST_NAME_LENGTH))
    .min(3, t(ValidatorMessage.FIRST_NAME_MIN_LENGTH));

export const validateRequiredLastName = () =>
  yup
    .string()
    .trim()
    .matches(/^\S*$/, t(ValidatorMessage.LAST_NAME_SPACE_NOT_VALID))
    .matches(nameRegExp, t(ValidatorMessage.LAST_NAME_NOT_VALID))
    .required(t(ValidatorMessage.LAST_NAME_REQ))
    .min(3, t(ValidatorMessage.LAST_NAME_MIN_LENGTH));

export const validateRequiredDOB = () =>
  yup.string().required(t("validation.dob.required")).nullable();

export const validateRequired = () =>
  yup.string().required(t("validation.required")).nullable();

export const validateRequiredCity = () =>
  yup
    .string()
    .nullable()
    .required(t(ValidatorMessage.CITY_REQ))
    .matches(nameRegExp, t(ValidatorMessage.CITY_NOT_VALID))
    .min(2, t(ValidatorMessage.MIN_VALUE_LIMIT_CITY_STATE));

export const validateRequiredPostalCode = () =>
  yup
    .string()
    .nullable()
    .required(t(ValidatorMessage.POSTAL_CODE_REQ))
    .matches(onlyNumber, t(ValidatorMessage.POSTAL_CODE_ELIGIBILTY))
    .max(6, t(ValidatorMessage.MAX_VALUE_LIMIT))
    .min(4, t(ValidatorMessage.MIN_VALUE_LIMIT));

export const validateRequiredAddress = () =>
  yup.string().nullable().required(t(ValidatorMessage.ADDRESS_REQ));

export const validateRequiredAddress2 = () =>
  yup.string().nullable().notRequired();

export const validateRequiredState = () =>
  yup
    .string()
    .nullable()
    .required(t(ValidatorMessage.STATE_REQ))
    .matches(/^[aA-zZ\s]+$/, t(ValidatorMessage.STATE_ELIGIBILITY))
    .min(2, t(ValidatorMessage.MIN_VALUE_LIMIT_CITY_STATE));

export const validateRequiredCountry = () =>
  yup.string().nullable().required(t(ValidatorMessage.COUNTRY_REQ));

export const validateJiraOrgAddress = () =>
  yup.string().nullable().required(t(ValidatorMessage.JIRA_ADDRESS_REQ));

export const validateJiraApiToken = () =>
  yup.string().nullable().required(t(ValidatorMessage.API_TOKEN_REQ));

export const validateJiraConfigurationSchema = yup.object().shape({
  orgAddress: validateJiraOrgAddress(),
  userEmail: validateRequiredEmail(),
  apiToken: validateJiraApiToken(),
});

export const validateAddDefectSchema = yup.object().shape({
  summary: yup.string().nullable().required(t(ValidatorMessage.SUMMARY_REQ)),
  project: yup.string().required(t(ValidatorMessage.PROJECT_REQ)),
  issueType: yup.object().required(t(ValidatorMessage.ISSUE_TYPE_REQ)),
  parent: yup.string().when("issueType", ([option], passSchema) => (option?.label === t("Subtask") ? 
    passSchema.required(t(ValidatorMessage.PARENT_REQ)) : passSchema.notRequired()))
});
