import { QuestList } from '@/components/quest/QuestList'
import { decodeToken, getServerToken } from '@/lib/auth'

interface DecodedToken {
  sub: string
  exp: number
}

const QuestPage = async () => {
  const token = await getServerToken()
  const decoded = token ? decodeToken(token) : null
  const userId = decoded?.sub || null

  if (!token || !userId) {
    return null
  }

  return <QuestList userId={userId} token={token} />
}

export default QuestPage
