<?php

namespace App\Repository;

use App\Entity\Friendship;
use App\Entity\FriendshipRequest;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method FriendshipRequest|null find($id, $lockMode = null, $lockVersion = null)
 * @method FriendshipRequest|null findOneBy(array $criteria, array $orderBy = null)
 * @method FriendshipRequest[]    findAll()
 * @method FriendshipRequest[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FriendshipRequestRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FriendshipRequest::class);
    }

    /**
     * @param User $user
     * @return Friendship[] Returns an array of Friendship objects
     */
    public function findUsersFriends(User $user)
    {
        return $this->createQueryBuilder('f')
            ->join('f.fromUser','fu')
            ->join('f.toUser','tu')
            ->select('f.id, fu.firstName, fu.lastName, fu.profileName, fu.profilePicture, f.createdAt')
            ->where('f.toUser = :user')
            ->setParameter(':user',$user)
            ->getQuery()
            ->getArrayResult()
            ;
    }

    public function findAmountOfRequests($user)
    {
        return $this->createQueryBuilder('f')
            ->join('f.fromUser','fu')
            ->join('f.toUser','tu')
            ->select('COUNT(f.id) as count')
            ->where('f.toUser = :user')
            ->setParameter(':user',$user)
            ->getQuery()
            ->getSingleResult()
            ;
    }

    /*
    public function findOneBySomeField($value): ?FriendshipRequest
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
