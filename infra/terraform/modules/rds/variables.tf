variable "project_name" {
  description = "Project name used for resource naming and tags."
  type        = string
  default     = "eventforge"
}

variable "environment" {
  description = "Deployment environment (dev, prod)."
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for the RDS subnet group."
  type        = list(string)
}

variable "rds_security_group_id" {
  description = "Security group for RDS (from networking module)."
  type        = string
}

variable "database_name" {
  description = "Initial Postgres database name."
  type        = string
  default     = "eventforge"
}

variable "master_username" {
  description = "Master database username."
  type        = string
  default     = "eventforge"
}

variable "engine_version" {
  description = "Postgres engine version (pgvector via Alembic CREATE EXTENSION)."
  type        = string
  default     = "16"
}

variable "instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t4g.micro"
}

variable "allocated_storage_gb" {
  description = "Initial allocated storage in GiB."
  type        = number
  default     = 20
}

variable "max_allocated_storage_gb" {
  description = "Maximum storage autoscaling limit in GiB."
  type        = number
  default     = 100
}

variable "backup_retention_days" {
  description = "Automated backup retention in days."
  type        = number
  default     = 7
}

variable "multi_az" {
  description = "Enable Multi-AZ deployment."
  type        = bool
  default     = false
}

variable "deletion_protection" {
  description = "Prevent accidental RDS deletion."
  type        = bool
  default     = false
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot on destroy (dev only)."
  type        = bool
  default     = true
}

variable "tags" {
  description = "Additional tags applied to RDS resources."
  type        = map(string)
  default     = {}
}
