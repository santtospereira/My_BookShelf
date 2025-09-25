'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteBookAction } from '@/actions/book'; // Importar a Server Action

interface Props {
  bookId: string;
  onDelete?: () => void; // Callback opcional para atualizar a lista
}

export default function DeleteBookButton({ bookId, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      await deleteBookAction(bookId);

      toast.success('Livro excluído com sucesso!');
      setIsOpen(false);
      
      // O onDelete (que chama router.refresh()) é chamado para atualizar a lista.
      if (onDelete) {
        onDelete();
      } else {
        // Fallback: navega para a página de livros e força a atualização.
        router.push('/books');
        router.refresh();
      }
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir o livro.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Excluir</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza?</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o livro
            do seu catálogo.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDelete}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
