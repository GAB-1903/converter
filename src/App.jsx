import { useMemo, useState } from 'react'
import './App.css'

const SCALE_LABELS = {
  C: 'Celsius (°C)',
  F: 'Fahrenheit (°F)',
  K: 'Kelvin (K)',
}

const ABSOLUTE_ZERO = {
  C: -273.15,
  F: -459.67,
  K: 0,
}

const FORMULAS = {
  'C->F': '°F = (°C × 9/5) + 32',
  'C->K': 'K = °C + 273,15',
  'F->C': '°C = (°F - 32) × 5/9',
  'F->K': 'K = (°F - 32) × 5/9 + 273,15',
  'K->C': '°C = K - 273,15',
  'K->F': '°F = (K - 273,15) × 9/5 + 32',
}

function convertTemperature(value, from, to) {
  if (from === to) return value

  if (from === 'C' && to === 'F') return (value * 9) / 5 + 32
  if (from === 'C' && to === 'K') return value + 273.15
  if (from === 'F' && to === 'C') return ((value - 32) * 5) / 9
  if (from === 'F' && to === 'K') return ((value - 32) * 5) / 9 + 273.15
  if (from === 'K' && to === 'C') return value - 273.15
  return ((value - 273.15) * 9) / 5 + 32
}

function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
  }).format(value)
}

function App() {
  const [temperature, setTemperature] = useState('')
  const [fromScale, setFromScale] = useState('C')
  const [result, setResult] = useState('')
  const [formula, setFormula] = useState('')
  const [message, setMessage] = useState('Digite uma temperatura e escolha o destino.')

  const fromScaleAbsoluteZero = useMemo(
    () => formatNumber(ABSOLUTE_ZERO[fromScale]),
    [fromScale],
  )

  const handleConvert = (toScale) => {
    const normalized = temperature.replace(',', '.').trim()

    if (!normalized) {
      setMessage('Informe um valor de temperatura antes de converter.')
      setResult('')
      setFormula('')
      return
    }

    const value = Number(normalized)

    if (Number.isNaN(value)) {
      setMessage('Valor inválido. Use apenas números, como 25, 25.5 ou 25,5.')
      setResult('')
      setFormula('')
      return
    }

    if (value < ABSOLUTE_ZERO[fromScale]) {
      setMessage(
        `Valor impossível para ${SCALE_LABELS[fromScale]}. O mínimo é ${fromScaleAbsoluteZero}.`,
      )
      setResult('')
      setFormula('')
      return
    }

    const converted = convertTemperature(value, fromScale, toScale)
    const equationKey = `${fromScale}->${toScale}`

    setResult(`${formatNumber(converted)} ${toScale === 'K' ? 'K' : `°${toScale}`}`)
    setFormula(
      fromScale === toScale
        ? 'Escala de origem e destino iguais: valor mantido.'
        : FORMULAS[equationKey],
    )
    setMessage(
      `Conversão de ${formatNumber(value)} ${
        fromScale === 'K' ? 'K' : `°${fromScale}`
      } para ${SCALE_LABELS[toScale]} realizada com sucesso.`,
    )
  }

  const clearForm = () => {
    setTemperature('')
    setResult('')
    setFormula('')
    setMessage('Digite uma temperatura e escolha o destino.')
  }

  return (
    <main className="app-shell">
      <section className="converter-card" aria-label="Conversor de temperatura">
        <p className="eyebrow">Aplicativo Colégio ECO </p>
        <h1>Conversor de Temperatura</h1>
        <p className="intro">
          Converta entre Celsius, Fahrenheit e Kelvin com fórmulas corretas e
          resultado imediato.
        </p>

        <label htmlFor="temperature" className="field-label">
          Temperatura
        </label>
        <input
          id="temperature"
          className="temperature-input"
          type="text"
          inputMode="decimal"
          placeholder="Ex: 36,5"
          value={temperature}
          onChange={(event) => setTemperature(event.target.value)}
        />

        <label htmlFor="from-scale" className="field-label">
          Escala de origem
        </label>
        <select
          id="from-scale"
          className="scale-select"
          value={fromScale}
          onChange={(event) => setFromScale(event.target.value)}
        >
          <option value="C">Celsius (°C)</option>
          <option value="F">Fahrenheit (°F)</option>
          <option value="K">Kelvin (K)</option>
        </select>

        <div className="button-group" role="group" aria-label="Botões de conversão">
          <button type="button" onClick={() => handleConvert('C')}>
            Converter para °C
          </button>
          <button type="button" onClick={() => handleConvert('F')}>
            Converter para °F
          </button>
          <button type="button" onClick={() => handleConvert('K')}>
            Converter para K
          </button>
        </div>

        <button type="button" className="clear-button" onClick={clearForm}>
          Limpar
        </button>

        <section className="result-panel" aria-live="polite">
          <h2>Resultado</h2>
          <p className="result-value">{result || '--'}</p>
          <p className="result-formula">{formula || 'A fórmula usada aparecerá aqui.'}</p>
          <p className="result-message">{message}</p>
        </section>
      </section>
    </main>
  )
}

export default App
