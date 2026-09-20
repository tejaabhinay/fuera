import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest, getApiErrorMessage } from '../services/api'

/**
 * Every data-driven section repeated the same fetch/abort/loading/error block.
 * This centralises it so a component only declares what it needs.
 *
 * `loading` is derived by comparing the settled request against the requested
 * one rather than set inside the effect, which avoids a cascading render and
 * means a path change reports loading immediately instead of one frame late.
 */
export function useApiResource(path, options = {}) {
  const { auth = false, errorMessage = 'Something went wrong. Please try again.' } = options
  const [reloadKey, setReloadKey] = useState(0)
  const [settled, setSettled] = useState({ key: null, data: null, error: '' })

  const requestKey = `${path}::${auth ? 'auth' : 'public'}::${reloadKey}`

  useEffect(() => {
    let active = true

    apiRequest(path, { auth })
      .then((data) => {
        if (active) setSettled({ key: requestKey, data, error: '' })
      })
      .catch((requestError) => {
        if (active) setSettled({ key: requestKey, data: null, error: getApiErrorMessage(requestError, errorMessage) })
      })

    return () => {
      active = false
    }
  }, [path, auth, errorMessage, requestKey])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])
  const loading = settled.key !== requestKey

  return useMemo(
    () => ({
      data: loading ? null : settled.data,
      loading,
      error: loading ? '' : settled.error,
      reload,
    }),
    [loading, settled.data, settled.error, reload],
  )
}
