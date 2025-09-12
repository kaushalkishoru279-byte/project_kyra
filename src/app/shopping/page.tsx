
"use client";

import { useState, ChangeEvent, KeyboardEvent, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, PlusCircle, Trash2, PackageOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';

interface ShoppingListItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
}

export default function ShoppingListsPage() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState('');
  const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({}); // { listId: itemText }
  const { toast } = useToast();
  const headers = { 'X-User-Id': 'demo-user', 'Content-Type': 'application/json' } as any;

  const loadLists = useCallback(async () => {
    try {
      const res = await fetch('/api/shopping', { headers, cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load lists');
      const data = await res.json();
      setShoppingLists(data);
    } catch (e) {
      setShoppingLists([]);
    }
  }, []);

  useEffect(() => { void loadLists(); }, [loadLists]);

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast({ title: "List name cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch('/api/shopping', { method: 'POST', headers, body: JSON.stringify({ name: newListName.trim() }) });
      if (!res.ok) throw new Error('create failed');
      setNewListName('');
      toast({ title: "Shopping List Created", description: `"${newListName.trim()}" has been added.` });
      await loadLists();
    } catch {
      toast({ title: "Failed to create list", variant: "destructive" });
    }
  };

  const handleDeleteList = async (listId: string) => {
    const listToDelete = shoppingLists.find(list => list.id === listId);
    try {
      const res = await fetch(`/api/shopping?id=${encodeURIComponent(listId)}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('delete failed');
      toast({ title: "Shopping List Deleted", description: listToDelete ? `"${listToDelete.name}" has been removed.` : undefined, variant: "destructive" });
      await loadLists();
    } catch {
      toast({ title: "Failed to delete list", variant: "destructive" });
    }
  };

  const handleAddItemToList = async (listId: string) => {
    const itemText = newItemTexts[listId]?.trim();
    if (!itemText) {
      toast({ title: "Item text cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch('/api/shopping/items', { method: 'POST', headers, body: JSON.stringify({ listId, text: itemText }) });
      if (!res.ok) throw new Error('add item failed');
      setNewItemTexts(prev => ({ ...prev, [listId]: '' }));
      await loadLists();
    } catch {
      toast({ title: "Failed to add item", variant: "destructive" });
    }
  };
  
  const handleItemInputChange = (listId: string, text: string) => {
    setNewItemTexts(prev => ({ ...prev, [listId]: text }));
  };

  const handleToggleItemComplete = async (_listId: string, itemId: string, currentCompleted: boolean) => {
    try {
      const res = await fetch('/api/shopping/items', { method: 'PATCH', headers, body: JSON.stringify({ id: itemId, completed: !currentCompleted }) });
      if (!res.ok) throw new Error('toggle failed');
      await loadLists();
    } catch {
      toast({ title: "Failed to update item", variant: "destructive" });
    }
  };

  const handleDeleteItem = async (listId: string, itemId: string) => {
    const list = shoppingLists.find(l => l.id === listId);
    const itemToDelete = list?.items.find(item => item.id === itemId);
    try {
      const res = await fetch(`/api/shopping/items?id=${encodeURIComponent(itemId)}`, { method: 'DELETE', headers });
      if (!res.ok) throw new Error('delete item failed');
      toast({ title: "Item Deleted", description: itemToDelete && list ? `"${itemToDelete.text}" removed from "${list.name}".` : undefined, variant: "destructive" });
      await loadLists();
    } catch {
      toast({ title: "Failed to delete item", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <ShoppingCart className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Shared Shopping Lists</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Create and manage shopping lists collaboratively with your family.
      </p>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Create New Shopping List</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Enter list name (e.g., Groceries, Weekend Errands)"
            value={newListName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewListName(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleCreateList()}
            className="flex-grow"
          />
          <Button onClick={handleCreateList}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create List
          </Button>
        </CardContent>
      </Card>

      {shoppingLists.length === 0 && (
        <Card className="shadow-sm border-dashed">
          <CardContent className="py-10 text-center">
            <PackageOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">No shopping lists yet!</p>
            <p className="text-sm text-muted-foreground">Create your first list above to get started.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shoppingLists.map(list => (
          <Card key={list.id} className="shadow-lg flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl">{list.name}</CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete List: "{list.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All items in this list will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteList(list.id)}>Delete List</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add new item..."
                  value={newItemTexts[list.id] || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleItemInputChange(list.id, e.target.value)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAddItemToList(list.id)}
                  className="flex-grow text-sm"
                />
                <Button size="sm" onClick={() => handleAddItemToList(list.id)}>Add</Button>
              </div>
              {list.items.length > 0 ? (
                <ul className="space-y-2 flex-grow overflow-y-auto max-h-72 custom-scrollbar pr-1">
                  {list.items.map(item => (
                    <li key={item.id} className="flex items-center gap-3 p-2.5 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={`item-${list.id}-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={() => handleToggleItemComplete(list.id, item.id, item.completed)}
                        aria-label={`Mark ${item.text} as ${item.completed ? 'incomplete' : 'complete'}`}
                      />
                      <label
                        htmlFor={`item-${list.id}-${item.id}`}
                        className={`flex-grow cursor-pointer text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {item.text}
                      </label>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 h-7 w-7">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Item: "{item.text}"?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteItem(list.id, item.id)}>Delete Item</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4 flex-grow flex items-center justify-center">
                  This list is empty. Add an item above!
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
