import { AbstractControl } from '@angular/forms';

export function cpfValidator(control: AbstractControl) {
  const value = control.value;
  if (!value) { return null; }
  const cpf = String(value).replace(/\D/g, '');
  if (cpf.length !== 11 || /(\d)\1{10}/.test(cpf)) {
    return { cpfInvalid: true };
  }
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let rev = (sum * 10) % 11;
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) {
    return { cpfInvalid: true };
  }
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rev = (sum * 10) % 11;
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10))) {
    return { cpfInvalid: true };
  }
  return null;
}