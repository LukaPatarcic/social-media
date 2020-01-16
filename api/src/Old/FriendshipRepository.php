<?php
//
//namespace App\Repository;
//
//use App\Entity\Friendship;
//use App\Entity\User;
//use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
//use Doctrine\Common\Persistence\ManagerRegistry;
//use Doctrine\ORM\AbstractQuery;
//
///**
// * @method Friendship|null find($id, $lockMode = null, $lockVersion = null)
// * @method Friendship|null findOneBy(array $criteria, array $orderBy = null)
// * @method Friendship[]    findAll()
// * @method Friendship[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
// */
//class FriendshipRepository extends ServiceEntityRepository
//{
//    public function __construct(ManagerRegistry $registry)
//    {
//        parent::__construct($registry, Friendship::class);
//    }
//
//    /**
//     * @param User $user
//     * @return Friendship[] Returns an array of Friendship objects
//     */
//    public function findUsersFriends(User $user)
//    {
//        return $this->createQueryBuilder('f')
//            ->join('f.friend','fu')
//            ->join('f.user','u')
//            ->addSelect('u')
//            ->addSelect('fu')
//            ->where('f.user = :user')
//            ->orWhere('f.friend = :user')
//            ->andWhere('f.status = 1')
//            ->setParameter(':user',$user)
//            ->getQuery()
//            ->getResult()
//        ;
//    }
//
//    public function findUsersRequests(int $userId)
//    {
//        return $this->createQueryBuilder('f')
//            ->join('f.friend','u')
//            ->addSelect('u')
//            ->andWhere('f.friend = :user')
//            ->andWhere('f.status = 0')
//            ->setParameter(':user',$userId)
//            ->getQuery()
//            ->getArrayResult()
//            ;
//    }
//
//    /*
//    public function findOneBySomeField($value): ?Friendship
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
//    */
//}
