output "address" {
  description = "RDS hostname for POSTGRES_HOST."
  value       = aws_db_instance.this.address
}

output "endpoint" {
  description = "RDS host:port endpoint."
  value       = aws_db_instance.this.endpoint
}

output "port" {
  description = "RDS port."
  value       = aws_db_instance.this.port
}

output "database_name" {
  description = "Database name."
  value       = aws_db_instance.this.db_name
}

output "master_username" {
  description = "Master username."
  value       = aws_db_instance.this.username
}

output "password_secret_arn" {
  description = "Secrets Manager ARN for POSTGRES_PASSWORD (plain string secret)."
  value       = aws_secretsmanager_secret.postgres_password.arn
}

output "instance_id" {
  description = "RDS instance identifier."
  value       = aws_db_instance.this.id
}

output "instance_arn" {
  description = "RDS instance ARN."
  value       = aws_db_instance.this.arn
}
