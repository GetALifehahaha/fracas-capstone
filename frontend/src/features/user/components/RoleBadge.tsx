import type { Role } from '@/common/types/Role'
import { Badge } from '@/common/ui/badge'
import { cn } from '@/common/utils/utils'
import capitalize from '@/common/utils/capitalize'

/** Colors read by tier: admin (highest) → operator → resident. */
const ROLE_STYLES: Record<Role, string> = {
    admin: 'bg-violet-100 text-violet-700',
    operator: 'bg-blue-100 text-blue-700',
    resident: 'bg-slate-100 text-slate-600',
}

const RoleBadge = ({ role }: { role: Role }) => {
    return <Badge className={cn(ROLE_STYLES[role])}>{capitalize(role)}</Badge>
}

export default RoleBadge
