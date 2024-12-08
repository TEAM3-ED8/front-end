import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PropTypes from 'prop-types';
import elf_1 from '@/assets/gnomo.webp'
import elf_2 from '@/assets/gnomo_2.webp'
import elf_3 from '@/assets/gnomo_3.webp'

  const avatars = [
    elf_1,
    elf_2,
    elf_3,
  ];

  export default function ElvesAvatar({ id, initials }) {
    const [avatarId, setAvatarId] = useState(null)
  
    useEffect(() => {
      const randomId = parseInt(id, 36) % avatars.length
      setAvatarId(randomId)
    }, [id])
  
    const avatarSrc = avatarId !== null ? avatars[avatarId] : undefined
  
    return (
      <Avatar>
        <AvatarImage src={avatarSrc} alt="Elf Avatar" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    )
  }

  ElvesAvatar.propTypes = {
    id: PropTypes.number.isRequired,
    initials: PropTypes.string.isRequired,

  };