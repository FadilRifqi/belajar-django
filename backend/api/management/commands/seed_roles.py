from django.core.management.base import BaseCommand
from api.models import Roles

class Command(BaseCommand):
    help = 'Seed the database with default roles'

    def handle(self, *args, **kwargs):
        # Create the 'admin' role if it doesn't exist
        if not Roles.objects.filter(name='admin').exists():
            Roles.objects.create(name='admin')
            self.stdout.write(self.style.SUCCESS('Admin role created'))

        # Create the 'user' role if it doesn't exist
        if not Roles.objects.filter(name='user').exists():
            Roles.objects.create(name='user')
            self.stdout.write(self.style.SUCCESS('User role created'))