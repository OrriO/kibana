/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { ImportRulesSchema } from './import_rules_schema';

export const validateAnomalyThreshold = (rule: ImportRulesSchema): string[] => {
  if (rule.type === 'machine_learning') {
    if (rule.anomaly_threshold == null) {
      return ['when "type" is "machine_learning" anomaly_threshold is required'];
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const validateQuery = (rule: ImportRulesSchema): string[] => {
  if (rule.type === 'machine_learning') {
    if (rule.query != null) {
      return ['when "type" is "machine_learning", "query" cannot be set'];
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const validateLanguage = (rule: ImportRulesSchema): string[] => {
  if (rule.type === 'machine_learning') {
    if (rule.language != null) {
      return ['when "type" is "machine_learning", "language" cannot be set'];
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const validateSavedId = (rule: ImportRulesSchema): string[] => {
  if (rule.type === 'saved_query') {
    if (rule.saved_id == null) {
      return ['when "type" is "saved_query", "saved_id" is required'];
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const validateMachineLearningJobId = (rule: ImportRulesSchema): string[] => {
  if (rule.type === 'machine_learning') {
    if (rule.machine_learning_job_id == null) {
      return ['when "type" is "machine_learning", "machine_learning_job_id" is required'];
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const validateTimelineId = (rule: ImportRulesSchema): string[] => {
  if (rule.timeline_id != null) {
    if (rule.timeline_title == null) {
      return ['when "timeline_id" exists, "timeline_title" must also exist'];
    } else if (rule.timeline_id === '') {
      return ['"timeline_id" cannot be an empty string'];
    } else {
      return [];
    }
  }
  return [];
};

export const validateTimelineTitle = (rule: ImportRulesSchema): string[] => {
  if (rule.timeline_title != null) {
    if (rule.timeline_id == null) {
      return ['when "timeline_title" exists, "timeline_id" must also exist'];
    } else if (rule.timeline_title === '') {
      return ['"timeline_title" cannot be an empty string'];
    } else {
      return [];
    }
  }
  return [];
};

export const validateThreshold = (rule: ImportRulesSchema): string[] => {
  if (rule.type === 'threshold') {
    if (!rule.threshold) {
      return ['when "type" is "threshold", "threshold" is required'];
    } else if (rule.threshold.value <= 0) {
      return ['"threshold.value" has to be bigger than 0'];
    } else {
      return [];
    }
  }
  return [];
};

export const importRuleValidateTypeDependents = (schema: ImportRulesSchema): string[] => {
  return [
    ...validateAnomalyThreshold(schema),
    ...validateQuery(schema),
    ...validateLanguage(schema),
    ...validateSavedId(schema),
    ...validateMachineLearningJobId(schema),
    ...validateTimelineId(schema),
    ...validateTimelineTitle(schema),
    ...validateThreshold(schema),
  ];
};
