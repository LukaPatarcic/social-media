<?php

namespace App\Repository;

use App\Entity\Friendship;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Friendship|null find($id, $lockMode = null, $lockVersion = null)
 * @method Friendship|null findOneBy(array $criteria, array $orderBy = null)
 * @method Friendship[]    findAll()
 * @method Friendship[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FriendshipRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Friendship::class);
    }

    /**
     * @param User $user
     * @return Friendship[] Returns an array of Friendship objects
     */
    public function findUsersFollowers(User $user,$limit = 10,$offset = 0)
    {
        return $this->createQueryBuilder('f')
            ->join('f.user','ff')
            ->join('ff.friends','fff')
            ->select('ff.firstName, ff.lastName, ff.profileName, ff.createdAt, ff.profilePicture')
            ->where('f.friend = :user')
            ->orderBy('f.createdAt','DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->setParameter(':user',$user)
            ->getQuery()
            ->getArrayResult()
            ;
    }


    /**
     * @param User $user
     * @return Friendship[] Returns an array of Friendship objects
     */
    public function findUsersFollowing(User $user,$limit = 10,$offset = 0)
    {
        return $this->createQueryBuilder('f')
            ->join('f.friend','ff')
            ->join('f.user','fu')
            ->select('ff.firstName, ff.lastName, ff.profileName, ff.createdAt, ff.profilePicture')
            ->where('f.user = :user')
            ->orderBy('f.createdAt','DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->setParameter(':user',$user)
            ->getQuery()
            ->getArrayResult()
            ;
    }

    public function findUsersRequests(int $userId)
    {
        return $this->createQueryBuilder('f')
            ->join('f.friend','u')
            ->addSelect('u')
            ->andWhere('f.friend = :user')
            ->andWhere('f.status = 0')
            ->setParameter(':user',$userId)
            ->getQuery()
            ->getArrayResult()
            ;
    }

}
