<InputMask
                                              mask={getPhoneMask(field.value)}
                                              value={field.value}
                                              onChange={(e) => { field.onChange(e); updateFieldValidity('telefone', !form.formState.errors.telefone); }}
                                              onBlur={(e) => { field.onBlur(); updateFieldValidity('telefone', !form.formState.errors.telefone); }}
                                            >
                                              {(inputProps: any) => <Input placeholder="(21) 99999-9999" {...inputProps} aria-describedby="error-telefone" />}
                                            </InputMask>