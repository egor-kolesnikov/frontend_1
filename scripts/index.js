const tests = {
  name: {
    regex: /^([a-zA-Zа-яА-я]{2,}\s*){1,3}$/,
    error: 'Введите ФИО!'
  },
  phone: {
    regex: /^\+7\s\([0-9]{3}\)\s[0-9]{3}(-[0-9]{2}){2}$/,
    error: 'Введите номер телефона!'
  },
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    error: 'Email введен не корректно!'
  }
}

const regexPhoneParse =
  /^(\+7|8|7)\s?\(?([0-9]{1,3})?\)?\s?([0-9]{1,3})?-?([0-9]{1,2})?-?([0-9]{1,2})?$/

function getValidPhone(array) {
  const validValue = `+7 (${array[0]}) ${array[1]}-${array[2]}-${array[3]}`
  return validValue
}

window.addEventListener('load', handleLoad)

function handleLoad() {
  const form = document.querySelector('[data-form]')
  const inputs = document.querySelectorAll('[data-input]')
  const submit = document.querySelector('[data-button]')

  const values = {
    name: '',
    phone: '',
    phone: '',
    message: ''
  }

  const errorsForm = {
    name: null,
    email: null,
    phone: null,
    get hasError() {
      return Boolean(this.email) || Boolean(this.name) || Boolean(this.phone)
    }
  }
  submit.disabled = true

  Array.from(inputs).forEach(input => {
    input.addEventListener('input', handleInput)
  })

  form.addEventListener('submit', handleSubmit)

  function handleInput(e) {
    const el = e.target
    const { name, value } = el
    const validObj = getValidValue(name, value)
    removeError(name)
    if (validObj.validValue) {
      el.value = validObj.validValue
      values[name] = validObj.validValue
    }
    if (validObj.error) {
      errorsForm[name] = setError(validObj.error, el)
    }
    submit.disabled = errorsForm.hasError || !values.name || !values.phone
  }

  function getValidValue(name, value) {
    switch (name) {
      case 'name': {
        const isValid = tests[name].regex.test(value)
        return isValid ? { validValue: value } : { error: tests[name].error }
      }
      case 'email': {
        if (value === '') return { validValue: '' }
        const isValid = tests[name].regex.test(value)
        return isValid ? { validValue: value } : { error: tests[name].error }
      }
      case 'phone': {
        return validationPhone(value)
      }
      default: {
        return { validValue: value }
      }
    }
  }

  function validationPhone(value) {
    value = value.slice(0, 18)
    if (tests.phone.regex.test(value)) return { validValue: value }

    if (regexPhoneParse.test(value)) {
      const parseMatchArray = value.match(regexPhoneParse)

      if (parseMatchArray[5]?.length === 2) {
        return { validValue: getValidPhone(parseMatchArray.slice(2, 6)) }
      }
      value = ''
      for (let i = 1; i <= 5; i++) {
        if (parseMatchArray[i]) value += parseMatchArray[i]
      }
      return { validValue: value, error: tests.phone.error }
    } else {
      return { error: tests.phone.error }
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    for (let key in values) {
      values[key] = values[key].trim()
    }
    console.log(values)
  }

  function setError(text, inputElement) {
    const errorElement = document.createElement('span')
    errorElement.classList.add('error')
    errorElement.innerHTML = text
    const parentElement = inputElement.closest('.input')
    parentElement.append(errorElement)
    return errorElement
  }
  function removeError(name) {
    errorsForm[name] && errorsForm[name].remove()
    errorsForm[name] = null
  }
}
