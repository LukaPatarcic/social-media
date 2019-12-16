<?php

namespace App\Command;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class DeleteTokenCommand extends Command
{
    protected static $defaultName = 'app:delete-token';
    /**
     * @var UserRepository
     */
    private $userRepository;
    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(UserRepository $userRepository, EntityManagerInterface $entityManager, string $name = null)
    {
        parent::__construct($name);
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
    }

    protected function configure()
    {
        $this
            ->setDescription('Add a short description for your command')
            ->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): ?bool
    {
        $io = new SymfonyStyle($input, $output);

        $users = $this->userRepository->findExpiredTokens();
        if(!$users) {
            $io->note('No tokens to delete');
            return null;
        }

        foreach ($users as $user) {
            $user->setToken('')
                ->setExpiresAt(null);
        }
        $this->entityManager->flush();

        $io->success(count($users).' tokens were deleted');

        return 0;
    }
}
