import { z } from "zod";

// Função para validar CPF (algoritmo de dígitos verificadores)
export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(cleaned[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === parseInt(cleaned[10]);
}

// Função para capitalizar primeira letra de cada palavra
export function capitalizeWords(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

// Schema Zod atualizado para nome/sobrenome
export const nameSchema = z.string()
  .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "O nome deve conter apenas letras e espaços." })
  .transform(val => capitalizeWords(val.trim()));

// Schema para email
export const emailSchema = z.string()
  .email({ message: "Digite um e-mail válido, como exemplo@email.com." })
  .transform(val => val.toLowerCase());

// Schema para CPF
export const cpfSchema = z.string()
  .transform(val => val.replace(/\D/g, ''))
  .refine(val => val.length === 11, { message: "Digite exatamente 11 dígitos numéricos para o CPF (ex.: 12345678901)." })
  .refine(val => isValidCPF(val), { message: "CPF inválido. Verifique os dígitos." });

// Schema para telefone
export const phoneSchema = z.string()
  .transform(val => val.replace(/\D/g, ''))
  .refine(val => val.length === 10 || val.length === 11, { message: "Digite 10 dígitos para telefone fixo (ex.: 2198765432) ou 11 para celular (ex.: 21987654321), incluindo DDD." });

// Schema para acompanhantes
export const companionSchema = z.array(
  z.string()
    .min(2, { message: "O nome do acompanhante deve ter pelo menos 2 caracteres." })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "O nome deve conter apenas letras e espaços." })
    .transform(val => capitalizeWords(val.trim()))
)
  .refine(names => names.length === new Set(names).size, { message: "Os nomes dos acompanhantes devem ser únicos." });