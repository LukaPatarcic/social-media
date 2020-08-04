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
     * @param $profileId
     * @param int $limit
     * @param int $offset
     * @return Friendship[] Returns an array of Friendship objects
     */
    public function findUsersFollowers($profileId,$limit = 10,$offset = 0)
    {
        return $this->createQueryBuilder('f')
            ->join('f.user','ff')
            ->join('ff.friends','fff')
            ->select('distinct ff.id, ff.firstName, ff.lastName, ff.profileName, ff.createdAt, ff.profilePicture')
            ->andWhere('f.friend = :profileId')
            ->orderBy('f.createdAt','DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->setParameter('profileId',$profileId)
            ->getQuery()
            ->getArrayResult()
            ;
    }


    /**
     * @param $profileId
     * @param int $limit
     * @param int $offset
     * @return Friendship[] Returns an array of Friendship objects
     */
    public function findUsersFollowing($profileId,$limit = 10,$offset = 0)
    {
        return $this->createQueryBuilder('f')
            ->join('f.friend','ff')
            ->join('f.user','fu')
            ->select('distinct ff.id, ff.firstName, ff.lastName, ff.profileName, ff.createdAt, ff.profilePicture')
            ->where('f.user = :profileId')
            ->orderBy('f.createdAt','DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->setParameter(':profileId',$profileId)
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
