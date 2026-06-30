variable "rds_instance_class" {
  description = "RDS instance class for dev Postgres."
  type        = string
  default     = "db.t4g.micro"
}

variable "rds_backup_retention_days" {
  description = "Automated backup retention in days."
  type        = number
  default     = 7
}

variable "rds_multi_az" {
  description = "Enable Multi-AZ RDS."
  type        = bool
  default     = false
}

variable "rds_deletion_protection" {
  description = "Prevent accidental RDS deletion."
  type        = bool
  default     = false
}

variable "rds_skip_final_snapshot" {
  description = "Skip final snapshot on destroy (dev only)."
  type        = bool
  default     = true
}

module "rds" {
  source = "../../modules/rds"

  project_name          = var.project_name
  environment           = var.environment
  private_subnet_ids    = module.networking.private_subnet_ids
  rds_security_group_id = module.networking.rds_security_group_id
  database_name         = var.postgres_db
  master_username       = var.postgres_user
  instance_class        = var.rds_instance_class
  backup_retention_days = var.rds_backup_retention_days
  multi_az              = var.rds_multi_az
  deletion_protection   = var.rds_deletion_protection
  skip_final_snapshot   = var.rds_skip_final_snapshot
  tags                  = var.tags
}
