<?php

namespace App\Repository;

use App\Entity\Message;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Message|null find($id, $lockMode = null, $lockVersion = null)
 * @method Message|null findOneBy(array $criteria, array $orderBy = null)
 * @method Message[]    findAll()
 * @method Message[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    public function findUsersByUser(User $user)
    {
        return $this->createQueryBuilder('m')
            ->join('m.fromUser','fu')
            ->join('m.toUser','tu')
            ->select('
                distinct
                fu.id as fromUserId,
                fu.profileName as fromUserProfileName, 
                fu.profilePicture as fromUserProfilePicture,
                tu.id as toUserId,
                tu.profileName as toUserProfileName,
                tu.profilePicture as toUserProfilePicture
              ')
            ->orWhere('m.toUser = :user')
            ->orWhere('m.fromUser = :user')
            ->setParameter('user',$user)
            ->getQuery()
            ->getArrayResult();
    }

    public function findLastUsersMessage($fromUserId,$toUserId)
    {
        try {
            return $this->createQueryBuilder('m')
                ->select('m.message, m.createdAt')
                ->orWhere('m.fromUser = :fromUser')
                ->orWhere('m.toUser = :toUser')
                ->setParameter('fromUser', $fromUserId)
                ->setParameter('toUser', $toUserId)
                ->orderBy('m.createdAt','DESC')
                ->getQuery()
                ->setMaxResults(1)
                ->getResult();
        } catch (NoResultException $e) {
            return [];
        } catch (NonUniqueResultException $e) {
            return [];
        }
    }

    public function findMessages($user,$friend,$offset)
    {
        return $this->createQueryBuilder('m')
            ->join('m.fromUser','fu')
            ->join('m.toUser','tu')
            ->select('
                fu.profileName as fromUserProfileName,fu.firstName as fromUserFirstName, fu.lastName as fromUserLastName, fu.profilePicture as fromUserProfilePicture,
                tu.profileName as toUserProfileName,tu.firstName as toUserFirstName, tu.lastName as toUserLastName, tu.profilePicture as toUserProfilePicture,
                m.message, m.createdAt
            ')
            ->where('(m.fromUser = :user AND m.toUser = :friend) OR (m.fromUser = :friend AND m.toUser = :user)')
            ->setParameter('user',$user)
            ->setParameter('friend',$friend)
            ->setMaxResults(20)
            ->orderBy('m.createdAt','ASC')
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }
}
